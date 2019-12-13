import MochaWebpack from './MochaWebpack'

// module.exports cause of babel 6
export function createMochaWebpack(): MochaWebpack {
  return new MochaWebpack()
}
