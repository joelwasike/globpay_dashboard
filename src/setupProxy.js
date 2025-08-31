const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy all API requests to merchants.globpay.ai
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://merchants.globpay.ai',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '/api', // No path rewriting needed
      },
      onProxyReq: (proxyReq, req, res) => {
        // Log proxy requests for debugging
        console.log('Proxying request:', req.method, req.url, '->', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Log proxy responses for debugging
        console.log('Proxy response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(500).json({ error: 'Proxy error: ' + err.message });
      }
    })
  );

  // Proxy auth requests to merchants.globpay.ai
  app.use(
    '/auth',
    createProxyMiddleware({
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
    })
  );

  // Proxy user management requests to merchants.globpay.ai
  app.use(
    '/users',
    createProxyMiddleware({
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
    })
  );

  // Proxy role management requests to merchants.globpay.ai
  app.use(
    '/roles',
    createProxyMiddleware({
      target: 'https://merchants.globpay.ai',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying role request:', req.method, req.url, '->', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Role proxy response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('Role proxy error:', err.message);
        res.status(500).json({ error: 'Role proxy error: ' + err.message });
      }
    })
  );

  // Proxy merchant management requests to merchants.globpay.ai
  app.use(
    '/merchants',
    createProxyMiddleware({
      target: 'https://merchants.globpay.ai',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying merchant request:', req.method, req.url, '->', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Merchant proxy response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('Merchant proxy error:', err.message);
        res.status(500).json({ error: 'Merchant proxy error: ' + err.message });
      }
    })
  );

  // Proxy payment processing requests to merchants.globpay.ai
  app.use(
    ['/process-payment', '/callback', '/globpay'],
    createProxyMiddleware({
      target: 'https://merchants.globpay.ai',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying payment request:', req.method, req.url, '->', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Payment proxy response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('Payment proxy error:', err.message);
        res.status(500).json({ error: 'Payment proxy error: ' + err.message });
      }
    })
  );

  // Proxy forex requests to merchants.globpay.ai
  app.use(
    '/forex',
    createProxyMiddleware({
      target: 'https://merchants.globpay.ai',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying forex request:', req.method, req.url, '->', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Forex proxy response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('Forex proxy error:', err.message);
        res.status(500).json({ error: 'Forex proxy error: ' + err.message });
      }
    })
  );

  // Proxy transaction requests to merchants.globpay.ai
  app.use(
    '/transaction',
    createProxyMiddleware({
      target: 'https://merchants.globpay.ai',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying transaction request:', req.method, req.url, '->', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Transaction proxy response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('Transaction proxy error:', err.message);
        res.status(500).json({ error: 'Transaction proxy error: ' + err.message });
      }
    })
  );

  // Proxy drawings requests to merchants.globpay.ai
  app.use(
    '/drawings',
    createProxyMiddleware({
      target: 'https://merchants.globpay.ai',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying drawings request:', req.method, req.url, '->', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Drawings proxy response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('Drawings proxy error:', err.message);
        res.status(500).json({ error: 'Drawings proxy error: ' + err.message });
      }
    })
  );
};
