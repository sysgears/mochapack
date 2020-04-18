import MochaWebpack from './MochaWebpack'
import { MochapackOptions } from './cli/argsParser/optionsFromParsedArgs/types'

export default function createMochaWebpack(
  options: MochapackOptions
): MochaWebpack {
  return new MochaWebpack(options)
}
