const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);
const workspaceRoot = path.resolve(__dirname, '../..');

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@smart-campus/types': path.resolve(workspaceRoot, 'packages/types/src'),
  '@smart-campus/validation': path.resolve(workspaceRoot, 'packages/validation/src'),
};

module.exports = withNativeWind(config, { input: './global.css' });
