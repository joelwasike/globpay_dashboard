const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://merchantapi.mam-laka.com',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api': '/api', // No path rewriting needed
      },
      onProxyReq: (proxyReq, req, res) => {
        // Log proxy requests for debugging
        console.log('Proxying request:', req.method, req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Log proxy responses for debugging
        console.log('Proxy response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
      }
    })
  );
};
