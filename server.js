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
        '^/api/depositos': '/Api/v3/depositos',
        '^/api/empresas/me/dados-basicos': '/Api/v3/empresas/me/dados-basicos',
        '^/api/estoques/saldos': '/Api/v3/estoques/saldos',
        '^/api/estoques': '/Api/v3/estoques',
        '^/api/nfe/([0-9]+)$': '/Api/v3/nfe/$1',
        '^/api/nfe': '/Api/v3/nfe',
        '^/api/pedidos/vendas/([0-9]+)$': '/Api/v3/pedidos/vendas/$1',
        '^/api/pedidos/vendas': '/Api/v3/pedidos/vendas',
        '^/api/produtos/([0-9]+)$': '/Api/v3/produtos/$1',
        '^/api/produtos/situacoes': '/Api/v3/produtos/situacoes',
        '^/api/produtos': '/Api/v3/produtos',
    },
    onProxyReq: (proxyReq, req, res) => {
        if (req.body) {
            const bodyData = Object.keys(req.body).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(req.body[key])}`).join('&');
            proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
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
