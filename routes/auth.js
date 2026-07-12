const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// In-memory mock database fallback
const mockUsers = [];

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

        const userExists = mockUsers.find(u => u.email === email);
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email address already registered' });
        }

        const user = { name, email, password };
        mockUsers.push(user);

        return res.status(201).json({
            success: true,
            token: generateToken(email),
            user: { name, email }
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

        const user = mockUsers.find(u => u.email === email);
        if (!user || user.password !== password) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        return res.status(200).json({
            success: true,
            token: generateToken(email),
            user: { name: user.name, email: user.email }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
