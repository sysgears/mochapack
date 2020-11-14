/* eslint-disable */
const path = require('path');

module.exports = {
  mode: 'development',
  target: 'node',
  output: {
    filename: 'bundle-custom-output-path.js',
    path: path.join(__dirname,  '../../fixtureTmp'),
    publicPath: ''
  },
  devServer: {
    writeToDisk: true,
  }
};
