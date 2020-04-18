import path from 'path'
import _ from 'lodash'

import parseArgv from './parseArgv'
import { existsFileSync } from '../util/exists'
import parseMochaOptsFile from './parseMochaOptsFile'
import requireWebpackConfig from './requireWebpackConfig'
import { ensureGlob, extensionsToGlob } from '../util/glob'
import createMochaWebpack from '../createMochaWebpack'
import { MochaWebpackOptions } from '../MochaWebpack'

function resolve(mod) {
  const absolute = existsFileSync(mod) || existsFileSync(`${mod}.js`)
  const file = absolute ? path.resolve(mod) : mod
  return file
}

function exit(lazy, code) {
  if (lazy) {
    process.on('exit', () => {
      process.exit(code)
    })
  } else {
    process.exit(code)
  }
}

async function cli() {
  const cliOptions = parseArgv(process.argv.slice(2), true)
  const configOptions = parseMochaOptsFile(cliOptions.opts)
  const requiresWebpackConfig =
    cliOptions.webpackConfig != null ||
    (configOptions as MochaWebpackOptions).webpackConfig != null
  const defaultOptions = parseArgv([])

  const options = _.defaults({}, cliOptions, configOptions, defaultOptions)

  options.require.forEach(mod => {
    require(resolve(mod)) // eslint-disable-line global-require, import/no-dynamic-require
  })

  options.include = options.include.map(resolve)

  options.webpackConfig = await requireWebpackConfig(
    options.webpackConfig,
    requiresWebpackConfig,
    options.webpackEnv,
    options.mode
  )

  const mochaWebpack = createMochaWebpack({
    mocha: {
      cli: {
        extension: _.get(options.webpackConfig, 'resolve.extensions', ['.js']),
        invert: options.invert,
        watchIgnore: []
      },
      constructor: {
        asyncOnly: options.asyncOnly,
        bail: options.bail,
        forbidOnly: options.forbidOnly,
        fullStackTrace: options.fullTrace,
        growl: options.growl,
        ignoreLeaks: !options.checkLeaks,
        inlineDiffs: options.inlineDiffs,
        reporter: options.reporter,
        reporterOptions: options.reporterOptions,
        retries: options.retries,
        slow: options.slow,
        timeout: options.timeout,
        ui: options.ui,
        useColors: options.colors
      }
    },
    webpack: {
      config: options.webpackConfig,
      include: options.include
    },
    mochapack: {
      interactive: options.interactive,
      clearTerminal: options.clearTerminal,
      quiet: options.quiet
    }
  })

  const extensions = _.get(options.webpackConfig, 'resolve.extensions', ['.js'])
  const fallbackFileGlob = extensionsToGlob(extensions)
  const fileGlob = options.glob != null ? options.glob : fallbackFileGlob

  options.files.forEach(f =>
    mochaWebpack.addEntry(ensureGlob(f, options.recursive, fileGlob))
  )

  mochaWebpack.webpackConfig(options.webpackConfig)

  if (options.fgrep) {
    mochaWebpack.fgrep(options.fgrep)
  }

  if (options.grep) {
    mochaWebpack.grep(options.grep)
  }

  await Promise.resolve()
    // @ts-ignore
    .then(() => {
      if (options.watch) {
        return mochaWebpack.watch()
      }
      return mochaWebpack.run()
    })
    .then(failures => {
      exit(options.exit, failures)
    })
    .catch(e => {
      if (e) {
        console.error(e.stack) // eslint-disable-line
      }
      exit(options.exit, 1)
    })
}

cli()
