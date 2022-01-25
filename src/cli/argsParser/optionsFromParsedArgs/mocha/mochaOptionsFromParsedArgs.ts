import {
  camelCase as _camelCase,
  cloneDeep as _cloneDeep,
  merge as _merge,
  omit as _omit,
  pick as _pick
} from 'lodash'
import { MochaOptions } from 'mocha'
import { ParsedMochaArgs } from '../../parseArgv/mocha/types'
import { MochaCliOptions, MochapackMochaOptions } from '../types'
import { ParsedArgs } from '../../parseArgv/types'
import {
  mergeMochaConfigWithConstructorOptions,
  mergeMochaConfigWithCliOptions
} from './mergeMochaConfigWithOptions'
import utils from '../../utils'

/**
 * Keep track of which keys are not applicable to the Mocha constructor here.
 */
export const mochaCliOptionArgs = [
  'config',
  'exit',
  'extension',
  'file',
  'files',
  'ignore',
  'invert',
  'list-interfaces',
  'list-reporters',
  'package',
  'recursive',
  'require',
  'sort',
  'watch',
  'watch-files',
  'watch-ignore'
]

/**
 * These arguments require some processing in order to be translated into an
 *   `MochaOptions` object to be used by Mochapack when initializing an
 *   instance of `Mocha`
 */
const argsThatDoNotDirectlyTranslateToMochaOptions = [
  'check-leaks',
  'color',
  'diff',
  'full-trace',
  'fgrep',
  'global',
  'grep',
  'no-colors',
  'reporter-option'
]

/**
 * Ensures that any options that are provided as strings but expected as
 *   numbers are converted to numbers in the output
 *
 * @param camelizedArgs Arguments that have been parsed and their keys have
 *   camelized
 */
const ensureNumericOptionsAreNumbers = <T extends Record<string, any>>(
  camelizedArgs: Record<string, any>
): T => {
  const optionsThatShouldBeNumbers = ['slow', 'timeout']
  const output = _cloneDeep(camelizedArgs)
  optionsThatShouldBeNumbers.forEach(optionName => {
    if (output[optionName])
      output[optionName] = parseInt(output[optionName] as string, 10)
  })
  return output as T
}

const colorsShouldBeUsed = (args: ParsedMochaArgs): boolean => {
  if (args['no-colors']) return false
  return !!args.color
}

const grepToUse = (args: ParsedMochaArgs): string | RegExp | undefined => {
  if (args.grep) return args.grep
  if (args.fgrep) return args.fgrep
  return undefined
}

/**
 * Translates camelized arguments into a `MochaOptions` object that can be
 *   directly provided to a Mocha initializer
 */
const translateObjectIntoMochaOptions = (
  args: ParsedMochaArgs
): MochaOptions => {
  const oneToOnes = _omit(args, argsThatDoNotDirectlyTranslateToMochaOptions)

  const ignoreLeaks = !args['check-leaks']
  const useColors = colorsShouldBeUsed(args)
  const hideDiff = !args.diff
  const fullStackTrace = args['full-trace']
  const globals = args.global
  const grep = grepToUse(args)
  const reporterOptions = args['reporter-option']

  const options: Record<string, any> = _merge(
    {},
    utils.camelizeKeys(oneToOnes),
    {
      ignoreLeaks,
      useColors,
      hideDiff,
      fullStackTrace,
      globals,
      grep,
      reporterOptions
    }
  )

  return ensureNumericOptionsAreNumbers<MochaOptions>(options)
}

/**
 * Extracts applicable options for Mocha constructor given a `ParsedMochaArgs`
 *   object
 *
 * @param parsedMochaArgs A `ParsedMochaArgs` object
 */
const extractMochaConstructorOptions = (
  parsedMochaArgs: ParsedMochaArgs
): MochaOptions => {
  const relevantArgs = _omit(parsedMochaArgs, mochaCliOptionArgs)
  const mochaOptions = translateObjectIntoMochaOptions(
    relevantArgs as ParsedMochaArgs
  )
  const mergedOptions = mergeMochaConfigWithConstructorOptions(
    mochaOptions as MochaOptions,
    parsedMochaArgs.config
  )

  return mergedOptions
}

/**
 * Extracts applicable options for Mocha CLI given a `ParsedMochaArgs`
 *   object
 *
 * @param parsedMochaArgs A `ParsedMochaArgs` object
 */
const extractMochaCliOptions = (
  parsedMochaArgs: ParsedMochaArgs
): MochaCliOptions => {
  const relevantArgs = _pick(parsedMochaArgs, mochaCliOptionArgs)
  const camelizedArgs = utils.camelizeKeys(relevantArgs)
  const mergedOptions = mergeMochaConfigWithCliOptions(
    (camelizedArgs as unknown) as MochaOptions,
    parsedMochaArgs.config,
    parsedMochaArgs.opts
  )

  return mergedOptions as MochaCliOptions
}

/**
 * Translates incoming arguments relevant to Mocha into options to be used in
 *   constructor of Mocha instance and in CLI run by Mochapack
 *
 * @param parsedArgs Arguments that have been parsed from CLI
 */
const mochaOptionsFromParsedArgs = (
  parsedArgs: ParsedArgs
): MochapackMochaOptions => ({
  constructor: extractMochaConstructorOptions(parsedArgs.mocha),
  cli: extractMochaCliOptions(parsedArgs.mocha)
})

export default mochaOptionsFromParsedArgs
