const express = require('express');
const router = express.Router();

// In-memory mock database fallback
const mockFeedbacks = [];

// @route   POST /api/feedback
// @desc    Submit customer feedback (Mocked)
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Please provide both your name and email address' });
        }

        const feedback = { name, email, createdAt: new Date() };
        mockFeedbacks.push(feedback);
        
        return res.status(201).json({ success: true, data: feedback });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
