const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Retrieve all products from MongoDB
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: 1 });
        return res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/products
// @desc    Create a product catalog item
router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        return res.status(201).json({ success: true, data: product });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
