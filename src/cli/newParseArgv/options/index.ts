import { Options } from 'yargs'
import mochaOptions from '../mocha/mochaOptions'

const MOCHAPACK_GROUP = 'Mochapack:'
const WEBPACK_GROUP = 'Webpack:'

const options: { [key: string]: Options } = {
  ...mochaOptions,
  quiet: {
    alias: 'q',
    type: 'boolean',
    default: undefined,
    describe: 'Suppress informational messages',
    group: MOCHAPACK_GROUP
  },
  interactive: {
    type: 'boolean',
    default: !!process.stdout.isTTY,
    describe: 'Force interactive mode (default enabled in terminal)',
    group: MOCHAPACK_GROUP
  },
  'clear-terminal': {
    type: 'boolean',
    default: false,
    describe: 'Clear current terminal, purging its history',
    group: MOCHAPACK_GROUP
  },
  glob: {
    type: 'string',
    describe: 'Test files matching <pattern> (only valid for directory entry)',
    group: MOCHAPACK_GROUP,
    requiresArg: true
  },
  include: {
    type: 'string',
    describe: 'Include the given module into test bundle',
    group: MOCHAPACK_GROUP,
    requiresArg: true
    // multiple: true
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
    requiresArg: true,
    default: 'webpack.config.js'
  },
  'webpack-env': {
    describe: 'Environment passed to the webpack config when it is a function',
    group: WEBPACK_GROUP
  }
}

export default options
