const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = ['mjs', 'js', 'json', 'ts', 'tsx', 'cjs'];

// Handle CORS and middleware properly for development
if (!config.server) {
  config.server = {};
}

// Configure middleware with proper CORS support
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    return middleware(req, res, next);
  };
};

module.exports = withNativeWind(config, { input: './global.css' });
