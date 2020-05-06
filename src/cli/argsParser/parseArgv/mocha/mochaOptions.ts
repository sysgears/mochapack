import defaults from 'mocha/lib/mocharc.json'
import createInvalidArgumentValueError from 'mocha/lib/errors'
import { list } from 'mocha/lib/cli/run-helpers'
import { ONE_AND_DONE_ARGS } from 'mocha/lib/cli/one-and-dones'
import { merge as _merge, omit as _omit } from 'lodash'
import { Options } from 'yargs'

/**
 * Eventually GROUPS and mochaOptions can be done away with when options can be
 *   directly imported from Mocha
 *
 * That can be done once this PR is merged:
 *   https://github.com/mochajs/mocha/pull/4122
 */
const GROUPS = {
  FILES: 'File Handling',
  FILTERS: 'Test Filters',
  NODEJS: 'Node.js & V8',
  OUTPUT: 'Reporting & Output',
  RULES: 'Rules & Behavior',
  CONFIG: 'Configuration'
}

const mochaOptions: { [key: string]: Options } = {
  'allow-uncaught': {
    description: 'Allow uncaught errors to propagate',
    group: GROUPS.RULES
  },
  'async-only': {
    description:
      'Require all tests to use a callback (async) or return a Promise',
    group: GROUPS.RULES
  },
  bail: {
    description: 'Abort ("bail") after first test failure',
    group: GROUPS.RULES
  },
  'check-leaks': {
    description: 'Check for global variable leaks',
    group: GROUPS.RULES
  },
  color: {
    description: 'Force-enable color output',
    group: GROUPS.OUTPUT
  },
  config: {
    config: true,
    defaultDescription: '(nearest rc file)',
    description: 'Path to config file',
    group: GROUPS.CONFIG
  },
  delay: {
    description: 'Delay initial execution of root suite',
    group: GROUPS.RULES
  },
  diff: {
    default: true,
    description: 'Show diff on failure',
    group: GROUPS.OUTPUT
  },
  exit: {
    description: 'Force Mocha to quit after tests complete',
    group: GROUPS.RULES
  },
  extension: {
    default: defaults.extension,
    description: 'File extension(s) to load',
    group: GROUPS.FILES,
    requiresArg: true,
    coerce: list
  },
  fgrep: {
    conflicts: 'grep',
    description: 'Only run tests containing this string',
    group: GROUPS.FILTERS,
    requiresArg: true
  },
  file: {
    defaultDescription: '(none)',
    description: 'Specify file(s) to be loaded prior to root suite execution',
    group: GROUPS.FILES,
    normalize: true,
    requiresArg: true
  },
  'forbid-only': {
    description: 'Fail if exclusive test(s) encountered',
    group: GROUPS.RULES
  },
  'forbid-pending': {
    description: 'Fail if pending test(s) encountered',
    group: GROUPS.RULES
  },
  'full-trace': {
    description: 'Display full stack traces',
    group: GROUPS.OUTPUT
  },
  global: {
    coerce: list,
    description: 'List of allowed global variables',
    group: GROUPS.RULES,
    requiresArg: true
  },
  grep: {
    coerce: value => (!value ? null : value),
    conflicts: 'fgrep',
    description: 'Only run tests matching this string or regexp',
    group: GROUPS.FILTERS,
    requiresArg: true
  },
  growl: {
    description: 'Enable Growl notifications',
    group: GROUPS.OUTPUT
  },
  ignore: {
    defaultDescription: '(none)',
    description: 'Ignore file(s) or glob pattern(s)',
    group: GROUPS.FILES,
    requiresArg: true
  },
  'inline-diffs': {
    description:
      'Display actual/expected differences inline within each string',
    group: GROUPS.OUTPUT
  },
  invert: {
    description: 'Inverts --grep and --fgrep matches',
    group: GROUPS.FILTERS
  },
  'list-interfaces': {
    conflicts: Array.from(ONE_AND_DONE_ARGS) as string[],
    description: 'List built-in user interfaces & exit'
  },
  'list-reporters': {
    conflicts: Array.from(ONE_AND_DONE_ARGS) as string[],
    description: 'List built-in reporters & exit'
  },
  'no-colors': {
    description: 'Force-disable color output',
    group: GROUPS.OUTPUT,
    hidden: true
  },
  package: {
    description: 'Path to package.json for config',
    group: GROUPS.CONFIG,
    normalize: true,
    requiresArg: true
  },
  recursive: {
    description: 'Look for tests in subdirectories',
    group: GROUPS.FILES
  },
  reporter: {
    default: defaults.reporter,
    description: 'Specify reporter to use',
    group: GROUPS.OUTPUT,
    requiresArg: true
  },
  'reporter-option': {
    coerce: opts =>
      list(opts).reduce((acc, opt) => {
        const pair = opt.split('=')
        if (pair.length > 2 || !pair.length) {
          throw createInvalidArgumentValueError(
            `invalid reporter option '${opt}'`,
            '--reporter-option',
            opt,
            'expected "key=value" format'
          )
        }

        acc[pair[0]] = pair.length === 2 ? pair[1] : true
        return acc
      }, {}),
    description: 'Reporter-specific options (<k=v,[k1=v1,..]>)',
    group: GROUPS.OUTPUT,
    requiresArg: true
  },
  require: {
    defaultDescription: '(none)',
    description: 'Require module',
    group: GROUPS.FILES,
    requiresArg: true
  },
  retries: {
    description: 'Retry failed tests this many times',
    group: GROUPS.RULES
  },
  slow: {
    default: defaults.slow,
    description: 'Specify "slow" test threshold (in milliseconds)',
    group: GROUPS.RULES
  },
  sort: {
    description: 'Sort test files',
    group: GROUPS.FILES
  },
  timeout: {
    default: defaults.timeout,
    description: 'Specify test timeout threshold (in milliseconds)',
    group: GROUPS.RULES
  },
  ui: {
    default: defaults.ui,
    description: 'Specify user interface',
    group: GROUPS.RULES,
    requiresArg: true
  },
  watch: {
    description: 'Watch files in the current working directory for changes',
    group: GROUPS.FILES
  },
  'watch-files': {
    description: 'List of paths or globs to watch',
    group: GROUPS.FILES,
    requiresArg: true,
    coerce: list
  },
  'watch-ignore': {
    description: 'List of paths or globs to exclude from watching',
    group: GROUPS.FILES,
    requiresArg: true,
    coerce: list,
    default: defaults['watch-ignore']
  }
}

/**
 * Cleans up Mocha's Yargs options to provide only those that are relevant to
 *   running Mochapack
 */
const mochaOptionsForMochapack = _merge(
  {},
  // Some options are irrelevant to actually running tests and should be run
  //   using Mocha from the command line directly
  _omit(mochaOptions, 'list-interfaces', 'list-reporters'),
  {
    opts: {
      type: 'string',
      describe: 'Path to Mocha options file (no longer supported by Mocha)',
      group: GROUPS.CONFIG,
      requiresArg: true
    } as Options
  },
  // Some options need to be adjusted to provide support for different Mocha
  //  versions
  {
    // Until Mocha 7.0.1, only js was included in extension
    extension: { default: ['js', 'cjs', 'mjs'] },
    // Not present until Mocha 6.2.0
    'watch-ignore': { default: ['node_modules', '.git'] }
  }
)

export default mochaOptionsForMochapack
