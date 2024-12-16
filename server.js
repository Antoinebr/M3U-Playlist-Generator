require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateM3UContent } = require('./index');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateApiKey = (req, res, next) => {
    const apiKey = req.query.code || req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'API key is required' });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Invalid API key' });
    }

    next();
};

// Function to generate authenticated URL
const generateAuthenticatedUrl = (urlPath) => {
    const baseUrl = process.env.BASE_URL.replace(/\/+$/, '');
    const username = encodeURIComponent(process.env.HTTP_AUTH_USERNAME);
    const password = encodeURIComponent(process.env.HTTP_AUTH_PASSWORD);
    return `${baseUrl.replace('://', `://${username}:${password}@`)}/${urlPath}`;
};

// Routes
app.get('/playlist', authenticateApiKey, (req, res) => {
    try {
        const videosPath = process.env.VIDEOS_PATH;

        if (!videosPath) {
            return res.status(500).json({ error: 'Videos path not configured' });
        }

        // Generate M3U content
        const videoFiles = generateM3UContent(videosPath);
        
        // Create M3U file content
        let m3uContent = '#EXTM3U\n';
        videoFiles.forEach(file => {
            // Replace backslashes with forward slashes for URLs
            const urlPath = file.replace(/\\/g, '/');
            m3uContent += `#EXTINF:-1,${path.basename(file, path.extname(file))}\n`;
            // Generate authenticated URL
            const fullUrl = generateAuthenticatedUrl(urlPath);
            m3uContent += `${fullUrl}\n`;
        });

        // Set content type for M3U file
        res.setHeader('Content-Type', 'application/x-mpegurl');
        res.setHeader('Content-Disposition', 'attachment; filename="playlist.m3u"');
        res.send(m3uContent);

    } catch (error) {
        console.error('Error generating playlist:', error);
        res.status(500).json({ error: 'Failed to generate playlist' });
    }
});

// Serve video files with basic auth
app.use('/videos', (req, res, next) => {
    const auth = {
        login: process.env.HTTP_AUTH_USERNAME,
        password: process.env.HTTP_AUTH_PASSWORD
    };

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === auth.login && password === auth.password) {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
