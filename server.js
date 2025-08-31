const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Proxy API requests to merchants.globpay.ai
app.use('/api', createProxyMiddleware({
  target: 'https://merchants.globpay.ai',
  changeOrigin: true,
  secure: false,
  logLevel: 'info',
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying request:', req.method, req.url, '->', proxyReq.path);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('Proxy response:', proxyRes.statusCode, req.url);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy error: ' + err.message });
  }
}));

// Proxy auth requests to merchants.globpay.ai
app.use('/auth', createProxyMiddleware({
  target: 'https://merchants.globpay.ai',
  changeOrigin: true,
  secure: false,
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying auth request:', req.method, req.url, '->', proxyReq.path);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('Auth proxy response:', proxyRes.statusCode, req.url);
  },
  onError: (err, req, res) => {
    console.error('Auth proxy error:', err.message);
    res.status(500).json({ error: 'Auth proxy error: ' + err.message });
  }
}));

// Proxy user management requests to merchants.globpay.ai
app.use('/users', createProxyMiddleware({
  target: 'https://merchants.globpay.ai',
  changeOrigin: true,
  secure: false,
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying user request:', req.method, req.url, '->', proxyReq.path);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('User proxy response:', proxyRes.statusCode, req.url);
  },
  onError: (err, req, res) => {
    console.error('User proxy error:', err.message);
    res.status(500).json({ error: 'User proxy error: ' + err.message });
  }
}));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API requests will be proxied to https://merchants.globpay.ai`);
});
