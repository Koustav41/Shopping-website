const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!mongoUri) {
        throw new Error('MongoDB connection string not found. Set MONGO_URI or MONGODB_URI in your environment variables.');
    }

    const conn = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
