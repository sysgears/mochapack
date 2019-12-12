let config = {
  mode: process.env.NODE_ENV || 'development',
  entry: './lib/index.js',
  devServer: {
    contentBase: './lib'
  }
};

const isMochapack = process.argv.reduce(
  (result, arg) => result || arg.endsWith('mochapack'), false
);

if (isMochapack) {
  config = Object.assign(config, {
    mode: 'development',
    target: 'node',
    devtool: 'inline-cheap-source-map',
    output: {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    }
  });
}

module.exports = config;
