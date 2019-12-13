import MochaWebpack from './MochaWebpack'

// module.exports cause of babel 6
export default function createMochaWebpack(): MochaWebpack {
  return new MochaWebpack()
}
