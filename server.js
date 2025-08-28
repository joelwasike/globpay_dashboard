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
  secure: true,
  logLevel: 'info',
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying request:', req.method, req.url, '->', proxyReq.path);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('Proxy response:', proxyRes.statusCode, req.url);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
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
