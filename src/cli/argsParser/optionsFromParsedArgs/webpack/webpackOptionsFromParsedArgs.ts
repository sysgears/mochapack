import { resolve } from 'path'
import { merge as _merge, pick as _pick } from 'lodash'
import { Configuration } from 'webpack'
import { ParsedArgs } from '../../parseArgv/types'
import { MochapackWebpackOptions } from '../types'
import requireWebpackConfig from './requireWebpackConfig'
import { WebpackMode } from '../../parseArgv/webpack/types'
import { existsFileSync } from '../../../../util/exists'

const resolveInclude = (mod: string): string => {
  const absolute = existsFileSync(mod) || existsFileSync(`${mod}.js`)
  const file = absolute ? resolve(mod) : mod
  return file
}

/**
 * Reads the user's webpack config based on provided arguments
 *
 * @param configPath The path to the webpack config provided by the user
 * @param env String to represent env provided by the user
 * @param mode String to represent mode provided by the user
 */
const readUserWebpackConfig = async (
  configPath?: string,
  env?: string,
  mode?: WebpackMode
): Promise<Configuration> => {
  const configProvidedByUser = !!configPath
  const usedConfigPath = configPath || 'webpack.config.js'

  return requireWebpackConfig(usedConfigPath, configProvidedByUser, env, mode)
}

/**
 * Translates incoming arguments relevant to Webpack into options to be used
 *   when running Webpack within Mochapack
 *
 * @param parsedArgs Arguments that have been parsed from CLI
 */
const webpackOptionsFromParsedArgs = async (
  parsedArgs: ParsedArgs
): Promise<MochapackWebpackOptions> => {
  const initialWebpackOptions: Partial<MochapackWebpackOptions> = _merge(
    _pick(parsedArgs.webpack, 'include', 'mode')
  )

  initialWebpackOptions.env = parsedArgs.webpack['webpack-env']

  const configPath = parsedArgs.webpack['webpack-config']
  const config = await readUserWebpackConfig(
    configPath,
    initialWebpackOptions.env,
    initialWebpackOptions.mode
  )
  const webpackOptions: MochapackWebpackOptions = {
    ...initialWebpackOptions,
    config
  }

  if (webpackOptions.include)
    webpackOptions.include = webpackOptions.include.map(resolveInclude)

  return webpackOptions
}

export default webpackOptionsFromParsedArgs
