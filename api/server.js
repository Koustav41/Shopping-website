const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ensure MongoDB is connected for each serverless invocation
app.use(async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }
        next();
    } catch (error) {
        next(error);
    }
});

app.use('/api/auth', require('../routes/auth'));
app.use('/api/products', require('../routes/products'));
app.use('/api/orders', require('../routes/orders'));
app.use('/api/feedback', require('../routes/feedback'));

// Export the Express app as the function handler for Vercel
module.exports = app;
