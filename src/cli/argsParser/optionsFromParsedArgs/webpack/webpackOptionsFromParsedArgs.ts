import { merge as _merge, pick as _pick } from 'lodash'
import { ParsedArgs } from '../../parseArgv/types'
import { MochapackWebpackOptions } from '../types'

/**
 * Translates incoming arguments relevant to Webpack into options to be used
 *   when running Webpack within Mochapack
 *
 * @param parsedArgs Arguments that have been parsed from CLI
 */
const webpackOptionsFromParsedArgs = (
  parsedArgs: ParsedArgs
): MochapackWebpackOptions => {
  const webpackOptions: MochapackWebpackOptions = _merge(
    {},
    _pick(parsedArgs.webpack, 'include', 'mode'),
    {
      config: parsedArgs.webpack['webpack-config']
    }
  )

  if (parsedArgs.webpack['webpack-env'])
    webpackOptions.env = parsedArgs.webpack['webpack-env']

  return webpackOptions
}

export default webpackOptionsFromParsedArgs
