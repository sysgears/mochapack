import { Options } from 'yargs'

const MOCHAPACK_GROUP = 'Mochapack:'

export const mochapackDefaults = {
  interactive: !!process.stdout.isTTY,
  'clear-terminal': false
}

const mochapackOptions: { [key: string]: Options } = {
  quiet: {
    alias: 'q',
    type: 'boolean',
    describe: 'Suppress informational messages',
    group: MOCHAPACK_GROUP
  },
  interactive: {
    type: 'boolean',
    default: mochapackDefaults.interactive,
    describe: 'Force interactive mode (default enabled in terminal)',
    group: MOCHAPACK_GROUP
  },
  'clear-terminal': {
    type: 'boolean',
    default: mochapackDefaults['clear-terminal'],
    describe: 'Clear current terminal, purging its history',
    group: MOCHAPACK_GROUP
  },
  glob: {
    type: 'string',
    describe: 'Test files matching <pattern> (only valid for directory entry)',
    group: MOCHAPACK_GROUP,
    requiresArg: true
  }
}

export default mochapackOptions
