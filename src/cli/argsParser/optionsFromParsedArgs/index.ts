import { ParsedArgs } from '../parseArgv/types'
import { MochapackOptions } from './types'
import mochaOptionsFromParsedArgs from './mocha/mochaOptionsFromParsedArgs'

/**
 * Translates parsed arguments into a `MochapackOptions` object
 *
 * @param parsedArgs Args that have been parsed into a `ParsedArgs` object
 */
const optionsFromParsedArgs = (parsedArgs: ParsedArgs): MochapackOptions => ({
  mocha: mochaOptionsFromParsedArgs(parsedArgs),
  webpack: {},
  mochapack: {}
})

export default optionsFromParsedArgs
