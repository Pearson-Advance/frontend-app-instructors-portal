const path = require('path');
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('webpack-dev', {
  resolve: {
    alias: {
      features: path.resolve(__dirname, 'src/features'),
      helpers: path.resolve(__dirname, 'src/helpers'),
      hooks: path.resolve(__dirname, 'src/hooks'),
    },
  },
});

// Allow access via local.openedx.io:1990
config.devServer = config.devServer || {};
config.devServer.allowedHosts = ['local.openedx.io'];
// (optional, but nice if you want LAN access)
config.devServer.host = '0.0.0.0';
config.devServer.port = process.env.PORT || 1990;

module.exports = config;
