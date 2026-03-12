const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = ['mjs', 'js', 'json', 'ts', 'tsx', 'cjs'];

module.exports = config;
