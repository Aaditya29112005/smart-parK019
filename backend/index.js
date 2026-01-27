const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve static files from the Vite build directory
const rootDir = process.cwd();
const distPath = path.join(rootDir, 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log(`[Server] Root directory: ${rootDir}`);
console.log(`[Server] Dist path: ${distPath}`);
console.log(`[Server] Index path: ${indexPath}`);

app.use(express.static(distPath));

// API routes placeholder
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Handle SPA routing: serve index.html for all non-API routes
app.get('(.*)', (req, res) => {
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error(`[Server] Error sending index.html: ${err.message}`);
            res.status(404).send('Not Found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
