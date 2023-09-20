const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://code-practice-web-app-server.vercel.app/',
      changeOrigin: true,
    })
  );
  
};