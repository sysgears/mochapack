import { pick as _pick } from 'lodash'
import Mocha from 'mocha'
import {
  createMissingArgumentError,
  createUnsupportedError
} from 'mocha/lib/errors'
import { ONE_AND_DONES } from 'mocha/lib/cli/one-and-dones'
import { handleRequires, validatePlugin } from 'mocha/lib/cli/run-helpers'
import { aliases, types } from 'mocha/lib/cli/run-option-metadata'
import yargs, { Arguments } from 'yargs'

import mochaOptions from './mochaOptions'
import { ParsedMochaArgs } from './types'

// Used to establish parity with Mocha's builder function in lib/cli/run.js
const mochaChecks = (yargsInstance: any, argv: Arguments) => {
  // "one-and-dones"; let yargs handle help and version
  Object.keys(ONE_AND_DONES).forEach(opt => {
    if (argv[opt]) {
      ONE_AND_DONES[opt].call(null, yargsInstance)
      process.exit()
    }
  })

  // yargs.implies() isn't flexible enough to handle this
  if (argv.invert && !('fgrep' in argv || 'grep' in argv)) {
    throw createMissingArgumentError(
      '"--invert" requires one of "--fgrep <str>" or "--grep <regexp>"',
      '--fgrep|--grep',
      'string|regexp'
    )
  }

  if (argv.compilers) {
    throw createUnsupportedError(
      `--compilers is DEPRECATED and no longer supported.
      See https://git.io/vdcSr for migration information.`
    )
  }

  if (argv.opts) {
    throw createUnsupportedError(
      `--opts: configuring Mocha via 'mocha.opts' is DEPRECATED and no longer supported.
      Please use a configuration file instead.`
    )
  }

  // load requires first, because it can impact "plugin" validation
  handleRequires(argv.require)
  validatePlugin(argv, 'reporter', Mocha.reporters)
  validatePlugin(argv, 'ui', Mocha.interfaces)

  return true
}

/**
 * Parses CLI arguments for Mocha using Yargs as closely as possible to how
 *   Mocha parses arguments when run from their CLI
 *
 * Note that some of this correlates with the builder in Mocha's lib/cli/run.js
 *
 * @param argv Arguments provided via CLI
 */
const parseMochaArgs = (argv: string[]): ParsedMochaArgs =>
  (yargs
    .options(mochaOptions)
    .check((args: Arguments) => mochaChecks(yargs, args))
    .alias(aliases)
    .array(types.array)
    .boolean(types.boolean)
    .string(types.string)
    .number(types.number)
    .parse(argv) as unknown) as ParsedMochaArgs

export default parseMochaArgs
