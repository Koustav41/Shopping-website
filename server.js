const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets from the root directory
app.use(express.static(__dirname));

// Catch-all route to serve the SPA index.html for undefined routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Open http://localhost:${PORT} in your browser`);
    });
};

if (process.env.VERCEL) {
    module.exports = app;
} else {
    try {
        startServer();
    } catch (error) {
        console.error('Server failed to start:', error.message);
        process.exit(1);
    }
}
