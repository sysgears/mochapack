import {
  camelCase as _camelCase,
  cloneDeep as _cloneDeep,
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
  'diff',
  'exit',
  'extension',
  'file',
  'ignore',
  'invert',
  'list-interfaces',
  'list-reporters',
  'package',
  'recursive',
  'require',
  'reporter-option',
  'sort',
  'watch',
  'watch-files',
  'watch-ignore'
]

/**
 * Ensures that any options that are provided as strings but expected as
 *   numbers are converted to numbers in the output
 *
 * @param camelizedArgs Arguments that have been parsed and their keys have
 *   camelized
 */
const ensureNumericOptionsAreNumbers = (
  camelizedArgs: Record<string, any>
): Record<string, any> => {
  const optionsThatShouldBeNumbers = ['slow', 'timeout']
  const output = _cloneDeep(camelizedArgs)
  optionsThatShouldBeNumbers.forEach(optionName => {
    if (output[optionName])
      output[optionName] = parseInt(output[optionName] as string, 10)
  })
  return output
}

const renameObjectKey = (
  obj: Record<string, any>,
  oldKey: string,
  newKey: string
): Record<string, any> => {
  const output = _cloneDeep(obj)
  if (output[oldKey]) output[newKey] = output[oldKey]
  delete output[oldKey]
  return output
}

const convertGlobalKeyToGlobals = (
  camelizedArgs: Record<string, any>
): Record<string, any> => renameObjectKey(camelizedArgs, 'global', 'globals')

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
  const camelizedArgs = utils.camelizeKeys(relevantArgs) as unknown
  let mochaOptions = ensureNumericOptionsAreNumbers(camelizedArgs)
  mochaOptions = convertGlobalKeyToGlobals(mochaOptions)
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
    parsedMochaArgs.config
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
