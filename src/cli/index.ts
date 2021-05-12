import { get as _get } from 'lodash'

import parseArgv from './argsParser/parseArgv'
import { ensureGlob, extensionsToGlob } from '../util/glob'
import createMochapack from '../createMochapack'
import optionsFromParsedArgs from './argsParser/optionsFromParsedArgs'

const exit = (lazy: boolean, code: number): void => {
  if (lazy) {
    process.on('exit', () => {
      process.exit(code)
    })
  } else {
    process.exit(code)
  }
}

async function cli() {
  const cliArgs = parseArgv(process.argv.slice(2))
  const cliOptions = await optionsFromParsedArgs(cliArgs)
  const mochaWebpack = createMochapack(cliOptions)

  const extensions = _get(cliOptions.webpack.config, 'resolve.extensions', [
    '.js'
  ])
  const fallbackFileGlob = extensionsToGlob(extensions)
  const fileGlob =
    cliOptions.mochapack.glob != null
      ? cliOptions.mochapack.glob
      : fallbackFileGlob

  cliOptions.mocha.cli.files.forEach(f =>
    mochaWebpack.addEntry(
      ensureGlob(f, cliOptions.mocha.cli.recursive, fileGlob)
    )
  )

  await Promise.resolve()
    // @ts-ignore
    .then(() => {
      if (cliOptions.mocha.cli.watch) {
        return mochaWebpack.watch()
      }
      return mochaWebpack.run()
    })
    .then((failures: number | void) => {
      exit(cliOptions.mocha.cli.exit, failures || 0)
    })
    .catch((e: Error) => {
      if (e) console.error(e.stack) // eslint-disable-line

      exit(cliOptions.mocha.cli.exit, 1)
    })
}

cli()
