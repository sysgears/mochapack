import { defaults as _defaults, omit as _omit, pick as _pick } from 'lodash'
import { loadConfig } from 'mocha/lib/cli/config'
import { MochaOptions } from 'mocha'
import { mochaCliOptionArgs } from './mochaOptionsFromParsedArgs'
import parseMochaOptsFile from './parseMochaOptsFile'
import { MochaCliOptions } from '../types'

/**
 * Don't reinvent the wheel here, use Mocha's config file loading function
 *   under the hood
 */
const loadMochaConfigFile = (configPath: string): MochaOptions =>
  loadConfig(configPath)

/**
 * Don't reinvent the wheel here, use Mocha's config file loading function
 *   under the hood
 */
const loadMochaOptsFile = (optsFilePath: string): MochaOptions =>
  parseMochaOptsFile(optsFilePath)

/**
 * Merges configuration from config and/or opts file with options from CLI
 */
const mergeMochaConfigWithOptions = <
  O extends 'cli' | 'constructor',
  T = O extends 'cli'
    ? MochaCliOptions
    : O extends 'constructor'
    ? MochaOptions
    : never
>(
  options: MochaOptions,
  optionsOutputType: O,
  configPath?: string,
  optsFilePath?: string
): T => {
  let configContents: MochaOptions = {}
  if (configPath) configContents = loadMochaConfigFile(configPath)
  if (optsFilePath)
    configContents = _defaults(configContents, loadMochaOptsFile(optsFilePath))

  if (optionsOutputType === 'cli') {
    return _defaults(
      {},
      options,
      _pick(configContents, mochaCliOptionArgs)
    ) as T
  }

  return _defaults({}, options, _omit(configContents, mochaCliOptionArgs)) as T
}

/**
 * If a config file is present, the options in it will be merged with those
 *   provided in the `options`. The values in `options` are preferred over
 *   those in the config file.
 *
 * @param options A `MochaOptions` object to extract options from
 * @param configPath Path to a Mocha config file
 */
export const mergeMochaConfigWithCliOptions = (
  options: MochaOptions,
  configPath?: string,
  optsFilePath?: string
): MochaCliOptions =>
  mergeMochaConfigWithOptions(options, 'cli', configPath, optsFilePath)

/**
 * If a config file is present, the options in it will be merged with those
 *   provided in the `options`. The values in `options` are preferred over
 *   those in the config file.
 *
 * @param options A `MochaOptions` object to extract options from
 * @param configPath Path to a Mocha config file
 */
export const mergeMochaConfigWithConstructorOptions = (
  options: MochaOptions,
  configPath?: string,
  optsFilePath?: string
): MochaOptions =>
  mergeMochaConfigWithOptions(options, 'constructor', configPath, optsFilePath)
