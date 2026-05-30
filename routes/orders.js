const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Log a new completed order
router.post('/', protect, async (req, res) => {
    try {
        const { items, subtotal, shippingCost, discount, total, paymentMethod, orderId } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cannot place order without cart items' });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            subtotal,
            shippingCost,
            discount,
            total,
            paymentMethod,
            orderId
        });

        return res.status(201).json({ success: true, data: order });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});

// @route   GET /api/orders/my-orders
// @desc    Get order history for authenticated user
router.get('/my-orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
