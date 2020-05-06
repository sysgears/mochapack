import { ParsedArgs } from '../parseArgv/types'
import { MochapackOptions } from './types'
import mochaOptionsFromParsedArgs from './mocha/mochaOptionsFromParsedArgs'
import webpackOptionsFromParsedArgs from './webpack/webpackOptionsFromParsedArgs'
import mochapackOptionsFromParsedArgs from './mochapack/mochapackOptionsFromParsedArgs'

/**
 * Translates parsed arguments into a `MochapackOptions` object
 *
 * @param parsedArgs Args that have been parsed into a `ParsedArgs` object
 */
const optionsFromParsedArgs = async (
  parsedArgs: ParsedArgs
): Promise<MochapackOptions> => ({
  mocha: mochaOptionsFromParsedArgs(parsedArgs),
  webpack: await webpackOptionsFromParsedArgs(parsedArgs),
  mochapack: mochapackOptionsFromParsedArgs(parsedArgs)
})

export default optionsFromParsedArgs
