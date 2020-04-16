import { merge as _merge, pick as _pick } from 'lodash'
import { ParsedArgs } from '../../parseArgv/types'
import { MochapackSpecificOptions } from '../types'
import utils from '../../utils'

/**
 * Translates incoming arguments relevant to Mochapack into options to be used
 *   when initializing Mochapack
 *
 * @param parsedArgs Arguments that have been parsed from CLI
 */
const mochapackOptionsFromParsedArgs = (
  parsedArgs: ParsedArgs
): MochapackSpecificOptions =>
  (utils.camelizeKeys(
    parsedArgs.mochapack
  ) as unknown) as MochapackSpecificOptions

export default mochapackOptionsFromParsedArgs
