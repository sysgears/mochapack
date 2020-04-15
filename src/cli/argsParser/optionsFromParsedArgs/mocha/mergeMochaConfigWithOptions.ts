import { defaults as _defaults, omit as _omit, pick as _pick } from 'lodash'
import { loadConfig } from 'mocha/lib/cli/config'
import { MochaOptions } from 'mocha'
import { mochaCliOptionArgs } from './mochaOptionsFromParsedArgs'

/**
 * Don't reinvent the wheel here, use Mocha's config file loading function
 *   under the hood
 */
const loadMochaConfigFile = (configPath: string): MochaOptions =>
  loadConfig(configPath)

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
  configPath?: string
): MochaOptions => {
  let configContents: MochaOptions = {}
  if (configPath) configContents = loadMochaConfigFile(configPath)
  return _defaults({}, options, _pick(configContents, mochaCliOptionArgs))
}

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
  configPath?: string
): MochaOptions => {
  let configContents: MochaOptions = {}
  if (configPath) configContents = loadMochaConfigFile(configPath)
  return _defaults({}, options, _omit(configContents, mochaCliOptionArgs))
}
