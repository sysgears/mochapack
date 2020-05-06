import { Options } from 'yargs'

const WEBPACK_GROUP = 'Webpack:'

const webpackOptions: { [key: string]: Options } = {
  include: {
    type: 'array',
    describe: 'Include the given module into test bundle',
    group: WEBPACK_GROUP,
    requiresArg: true
  },
  mode: {
    type: 'string',
    choices: ['development', 'production'],
    describe: 'Webpack mode to use',
    group: WEBPACK_GROUP,
    requiresArg: true
  },
  'webpack-config': {
    type: 'string',
    describe: 'Path to Webpack config file',
    group: WEBPACK_GROUP,
    requiresArg: true
  },
  'webpack-env': {
    type: 'string',
    describe: 'Environment passed to the webpack config when it is a function',
    group: WEBPACK_GROUP
  }
}
export default webpackOptions
