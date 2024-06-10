const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware para lidar com preflight requests
app.options('/api/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

// Proxy middleware
app.use('/api', createProxyMiddleware({
    target: 'https://www.bling.com.br',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/Api/v3/oauth/token', // reescreve '/api' para '/Api/v3/oauth/token'
    },
    onProxyReq: (proxyReq, req, res) => {
        if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    },
    onError: (err, req, res) => {
        res.status(500).json({ error: 'Proxy Error', details: err.message });
    }
}));

app.listen(PORT, () => {
    console.log(`Proxy server with CORS is running on http://localhost:${PORT}`);
});
