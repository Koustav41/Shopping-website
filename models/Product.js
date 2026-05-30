const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a product title'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a product price']
    },
    originalPrice: {
        type: Number,
        default: null
    },
    category: {
        type: String,
        required: [true, 'Please add a product category'],
        trim: true
    },
    stockCount: {
        type: Number,
        default: null
    },
    stockStatus: {
        type: String,
        enum: ['instock', 'low', 'out'],
        default: 'instock'
    },
    image: {
        type: String,
        required: [true, 'Please add a product image path/URL']
    },
    badge: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
