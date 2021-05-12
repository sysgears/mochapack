/* eslint-disable */
global.Worker = require('tiny-worker'); // webworker polyfill for node

module.exports = {
  mode: 'development',
  target: 'node',
  devServer: {
    writeToDisk: (filePath) => {
      return /\.worker\.js$/.test(filePath);
    },
  }
};
