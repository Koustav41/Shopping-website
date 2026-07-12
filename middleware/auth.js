const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const secret = process.env.JWT_SECRET || 'fallback-secret';
            
            // Decoded holds the user's email or ID from token
            const decoded = jwt.verify(token, secret);
            
            // Set mock user on request
            req.user = {
                _id: 'mock-user-id',
                name: 'Mock User',
                email: decoded.id || 'mock@example.com'
            };
            
            return next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };
