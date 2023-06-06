const { createProxyMiddleware } = require('http-proxy-middleware');

//
// Q: Why setupProxy.js?
//
// When I'm on a browser and send a 'relative request'
// such as /api/users/register, which is a relative path,
// a proxy such as this will concatenate/amend that path
// by turning it into http://my_inputted_host:9999/api/users/register
//

// Q: Why 5000?
// Because this is where Express runs/serves.

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};

// NOTE:

// This setup is for development purposes.
// It won't affect the production build.
// Thus, it won't affect how cookies are handled in production.
// In a production setting, the browser will send cookies
//   with requests to the same domain from which the cookies
//   originated, as per the standard Same-Origin policy.