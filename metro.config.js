/* eslint-env node */
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  "@": require("path").resolve(__dirname, "src"),
};

config.resolver.assetExts.push("png", "jpg", "mp3");
config.watchFolders = [__dirname + "/src/assets"];

module.exports = config;
