import webpack, { Compiler } from 'webpack'

export default function createCompiler(webpackConfig: {}): Compiler {
  const compiler = webpack(webpackConfig)

  return compiler
}
