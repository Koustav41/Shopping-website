const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// In-memory mock database fallback
const mockUsers = [];

// Helper to check MongoDB connection and get model
const findUserByEmail = async (email) => {
    if (require('mongoose').connection.readyState === 1) {
        const User = require('../models/User');
        return await User.findOne({ email });
    }
    return mockUsers.find(u => u.email === email);
};

// Helper to generate JWT token
const generateToken = (email) => {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    return jwt.sign({ id: email }, secret, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please add all registration fields' });
        }

        const userExists = await findUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email address already registered' });
        }

        let user;
        if (require('mongoose').connection.readyState === 1) {
            const User = require('../models/User');
            const newUser = new User({ name, email, password, isGoogle: false });
            await newUser.save();
            user = newUser;
        } else {
            user = { name, email, password, isGoogle: false, createdAt: new Date() };
            mockUsers.push(user);
        }

        return res.status(201).json({
            success: true,
            token: generateToken(email),
            user: { name: user.name, email: user.email, isGoogle: false }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please add login email and password' });
        }

        const user = await findUserByEmail(email);
        if (!user || user.password !== password) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        return res.status(200).json({
            success: true,
            token: generateToken(email),
            user: { 
                name: user.name, 
                email: user.email,
                picture: user.picture || '',
                isGoogle: user.isGoogle || false
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/auth/google-login
// @desc    Authenticate user with Google credentials
router.post('/google-login', async (req, res) => {
    try {
        const { credential, email, name, picture } = req.body;

        if (!email || !name) {
            return res.status(400).json({ success: false, message: 'Missing user details' });
        }

        let user = await findUserByEmail(email);
        if (!user) {
            // Register new user from Google details
            user = {
                name,
                email,
                phone: '',
                address: '',
                picture: picture || '',
                isGoogle: true,
                createdAt: new Date()
            };

            if (require('mongoose').connection.readyState === 1) {
                const User = require('../models/User');
                // Set a secure random string for Google login password requirements
                user.password = Math.random().toString(36).substring(2, 12);
                const newUser = new User(user);
                await newUser.save();
                user = newUser;
            } else {
                mockUsers.push(user);
            }
        } else {
            // Update Google picture if changed
            if (picture && user.picture !== picture) {
                if (require('mongoose').connection.readyState === 1) {
                    const User = require('../models/User');
                    user = await User.findOneAndUpdate({ email }, { $set: { picture } }, { new: true });
                } else {
                    user.picture = picture;
                }
            }
        }

        return res.status(200).json({
            success: true,
            token: credential || generateToken(email),
            user: {
                name: user.name,
                email: user.email,
                picture: user.picture || '',
                isGoogle: true
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/auth/profile
// @desc    Retrieve authenticated user's profile details
router.get('/profile', protect, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userRes = {
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            picture: user.picture || '',
            isGoogle: user.isGoogle || false,
            createdAt: user.createdAt
        };

        return res.status(200).json({ success: true, user: userRes });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/auth/profile
// @desc    Modify authenticated user's profile details
router.put('/profile', protect, async (req, res) => {
    try {
        const email = req.user.email;
        const { name, phone, address, password } = req.body;

        let user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (require('mongoose').connection.readyState === 1) {
            const User = require('../models/User');
            const updateData = { name, phone, address };
            
            // Only update password if provided and not a Google managed account
            if (password && !user.isGoogle) {
                updateData.password = password;
            }
            
            const updatedUser = await User.findOneAndUpdate(
                { email },
                { $set: updateData },
                { new: true }
            );
            user = updatedUser;
        } else {
            user.name = name || user.name;
            user.phone = phone !== undefined ? phone : user.phone;
            user.address = address !== undefined ? address : user.address;
            
            if (password && !user.isGoogle) {
                user.password = password;
            }
        }

        const userRes = {
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            picture: user.picture || '',
            isGoogle: user.isGoogle || false
        };

        return res.status(200).json({ success: true, message: 'Profile updated successfully', user: userRes });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
