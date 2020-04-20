import Mochapack from './Mochapack'
import { MochapackOptions } from './cli/argsParser/optionsFromParsedArgs/types'

export default function createMochapack(options: MochapackOptions): Mochapack {
  return new Mochapack(options)
}
