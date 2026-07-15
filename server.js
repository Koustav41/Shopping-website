const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'shared-data.json');

function ensureDataStore() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '{}', 'utf8');
    }

    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (error) {
        console.warn('Failed to parse shared data store, resetting it.', error.message);
        fs.writeFileSync(DATA_FILE, '{}', 'utf8');
        return {};
    }
}

let sharedData = ensureDataStore();

function persistSharedData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(sharedData, null, 2), 'utf8');
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets from the root directory
app.use(express.static(__dirname));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/data/:key', (req, res) => {
    const { key } = req.params;
    res.json({ key, value: Object.prototype.hasOwnProperty.call(sharedData, key) ? sharedData[key] : null });
});

app.put('/api/data/:key', (req, res) => {
    const { key } = req.params;
    const { value } = req.body || {};
    sharedData[key] = value;
    persistSharedData();
    res.json({ key, value });
});

app.delete('/api/data/:key', (req, res) => {
    const { key } = req.params;
    if (Object.prototype.hasOwnProperty.call(sharedData, key)) {
        delete sharedData[key];
        persistSharedData();
    }
    res.json({ key, deleted: true });
});

// Catch-all route to serve the SPA index.html for undefined routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const startServer = () => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Open http://localhost:${PORT} in your browser`);
        console.log(`Or use your local IP address from the same network, for example http://192.168.1.10:${PORT}`);
    });
};

if (require.main === module) {
    try {
        startServer();
    } catch (error) {
        console.error('Server failed to start:', error.message);
        process.exit(1);
    }
}

module.exports = { app, startServer };
