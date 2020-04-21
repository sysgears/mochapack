import { cloneDeep as _cloneDeep, pick as _pick } from 'lodash'
import yargs from 'yargs'
import { parseMochaArgs, pruneMochaYargsOutput } from './mocha/parseMochaArgs'
import mochaOptions from './mocha/mochaOptions'
import mochapackOptions from './mochapack/mochapackOptions'
import { ParsedMochapackArgs } from './mochapack/types'
import { ParsedWebpackArgs } from './webpack/types'
import webpackOptions from './webpack/webpackOptions'
import { UndifferentiatedParsedArgs, ParsedArgs } from './types'

/**
 * Picks a subset of parsed arguments that applies to the provided option set
 *
 * @param parsedArgs Args that have already been parsed
 * @param options The set of options to derive a set of keys from to select
 *   values from the parsed args
 */
const pickParsedArgs = <T extends ParsedWebpackArgs | ParsedMochapackArgs>(
  parsedArgs: UndifferentiatedParsedArgs,
  options: typeof webpackOptions | typeof mochapackOptions
): T => _pick(parsedArgs, Object.keys(options)) as T

/**
 * Parses the incoming arguments using the options
 * @param argv An array of arguments to parse
 */
const parse = (argv: string[]): UndifferentiatedParsedArgs =>
  (yargs
    .help('help')
    .alias('help', 'h')
    .version()
    .options({ ...webpackOptions, ...mochapackOptions /* ...mochaOptions */ })
    .parse(argv) as unknown) as UndifferentiatedParsedArgs

/**
 * Parses arguments passed in via CLI and provides a `MochaCliOptions` object
 *   as output
 *
 * @param argv Arguments passed in via CLI
 */
const parseArgv = (argv: string[]): ParsedArgs => {
  const parsedArgs = parse(argv)

  const webpack = pickParsedArgs<ParsedWebpackArgs>(parsedArgs, webpackOptions)
  const mochapack = pickParsedArgs<ParsedMochapackArgs>(
    parsedArgs,
    mochapackOptions
  )

  return {
    mocha: pruneMochaYargsOutput(parseMochaArgs(argv)),
    webpack,
    mochapack
  }
}

export default parseArgv
