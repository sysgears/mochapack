import { cloneDeep as _cloneDeep, pick as _pick } from 'lodash'

import mochaOptions from './mocha/mochaOptions'
import parseMochaArgs from './mocha/parseMochaArgs'
import { ParsedMochaArgs } from './mocha/types'

type MochaPackParsedArgs = {}

/**
 * Need to ensure any keys unknown to Mocha are not included in Yargs output
 */
const pruneMochaYargsOutput = (yargsOutput): ParsedMochaArgs =>
  _pick(yargsOutput, Object.keys(mochaOptions)) as ParsedMochaArgs

/**
 * Parses arguments passed in via CLI and provides a `MochaCliOptions` object
 *   as output
 *
 * @param argv Arguments passed in via CLI
 */
const parseArgv = (argv: string[]) => ({
  mocha: pruneMochaYargsOutput(parseMochaArgs(argv))
})

export default parseArgv
