const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://merchants.globpay.ai',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        // Log proxy requests for debugging
        console.log('Proxying request:', req.method, req.url, '->', proxyReq.path);
        console.log('Target URL:', 'https://merchants.globpay.ai' + proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Log proxy responses for debugging
        console.log('Proxy response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        console.error('Proxy error details:', err);
      }
    })
  );
};
