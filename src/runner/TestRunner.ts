import path from 'path'
import EventEmitter from 'events'
import _ from 'lodash'
import chokidar from 'chokidar'
import minimatch from 'minimatch'
import webpack, { Configuration as WebpackConfig, Compiler, Stats } from 'webpack'
import Mocha from 'mocha'

import createCompiler from '../webpack/compiler/createCompiler'
import createWatchCompiler, {
  WatchCompiler
} from '../webpack/compiler/createWatchCompiler'
import registerInMemoryCompiler from '../webpack/compiler/registerInMemoryCompiler'
import registerReadyCallback from '../webpack/compiler/registerReadyCallback'
import getBuildStats, { BuildStats } from '../webpack/util/getBuildStats'
import webpack4GetBuildStats from '../webpack/util/webpack4GetBuildStats'

import createWebpackConfig from './runnerUtils/createWebpackConfig'
import {
  WEBPACK_START_EVENT,
  MOCHAPACK_NAME,
  WEBPACK_READY_EVENT,
  MOCHA_BEGIN_EVENT,
  MOCHA_FINISHED_EVENT,
  EXCEPTION_EVENT,
  MOCHA_ABORTED_EVENT,
  ENTRY_REMOVED_EVENT,
  ENTRY_ADDED_EVENT,
  UNCAUGHT_EXCEPTION_EVENT
} from '../util/constants'
import initMocha from './runnerUtils/initMocha'
import { MochapackOptions } from '../cli/argsParser/optionsFromParsedArgs/types'

const entryPath = path.resolve(__dirname, '../entry.js')
const entryLoaderPath = path.resolve(
  __dirname,
  '../webpack/loader/entryLoader.js'
)
const includeLoaderPath = path.resolve(
  __dirname,
  '../webpack/loader/includeFilesLoader.js'
)
const noop = () => undefined

type MochaRunner = {
  abort: () => void
  currentRunnable?: {
    retries: (count: number) => void
    timeout: (ms: number) => void
    resetTimeout: (ms: number) => void
  }
}

export default class TestRunner extends EventEmitter {
  entries: Array<string>

  includes: Array<string>

  options: MochapackOptions

  cwd: string

  constructor(
    entries: Array<string>,
    includes: Array<string>,
    options: MochapackOptions,
    cwd: string
  ) {
    super()
    this.entries = entries
    this.includes = includes
    this.options = options
    this.cwd = cwd
  }

  prepareMocha(webpackConfig: WebpackConfig, stats: Stats): Mocha {
    const mocha: Mocha = initMocha(this.options.mocha, this.cwd)
    const outputPath = webpackConfig.output.path

    let buildStats: BuildStats
    if (webpack.version[0] === '4') {
      buildStats = webpack4GetBuildStats(stats, outputPath)
    } else {
      buildStats = getBuildStats(stats, outputPath)
    }

    // @ts-ignore
    global.__webpackManifest__ = buildStats.affectedModules // eslint-disable-line

    // clear up require cache for changed files to make sure that we get the latest changes
    buildStats.affectedFiles.forEach(filePath => {
      delete require.cache[filePath]
    })
    // Pass webpack's entry files to mocha.
    // Make sure to add them via `addFile` otherwise they blow away any other files
    // that might have been added via `--file`
    buildStats.entries.forEach(entry => {
      mocha.addFile(entry)
    })
    return mocha
  }

  async run(): Promise<number> {
    const { webpackConfig: config } = await this.createWebpackConfig()
    let failures = 0
    const compiler: Compiler = createCompiler(config)

    compiler.hooks.run.tapAsync(MOCHAPACK_NAME, (c, cb) => {
      this.emit(WEBPACK_START_EVENT)
      cb()
    })

    const dispose = registerInMemoryCompiler(compiler)
    try {
      failures = await new Promise((resolve, reject) => {
        registerReadyCallback(
          compiler,
          (err: Error, webpackStats: Stats) => {
            this.emit(WEBPACK_READY_EVENT, err, webpackStats)
            if (err || !webpackStats) {
              reject()
              return
            }
            try {
              const mocha = this.prepareMocha(config, webpackStats)
              this.emit(MOCHA_BEGIN_EVENT)
              try {
                mocha.run(fails => {
                  this.emit(MOCHA_FINISHED_EVENT, fails)
                  resolve(fails)
                })
              } catch (e) {
                this.emit(EXCEPTION_EVENT, e)
                resolve(1)
              }
            } catch (e) {
              reject(e)
            }
          }
        )
        compiler.run(noop)
      })
    } finally {
      // clean up single run
      dispose()
    }
    return failures
  }

  async watch(): Promise<void> {
    const {
      webpackConfig: config,
      entryConfig
    } = await this.createWebpackConfig()

    let mochaRunner: MochaRunner | null = null
    let stats: Stats | null = null
    let compilationScheduler: () => void | null = null

    const uncaughtExceptionListener = err => {
      // mocha catches uncaughtException only while tests are running,
      // that's why we register a custom error handler to keep this process alive
      this.emit(UNCAUGHT_EXCEPTION_EVENT, err)
    }

    const runMocha = () => {
      try {
        const mocha = this.prepareMocha(config, stats)
        // unregister our custom exception handler (see declaration)
        process.removeListener(
          UNCAUGHT_EXCEPTION_EVENT,
          uncaughtExceptionListener
        )

        // run tests
        this.emit(MOCHA_BEGIN_EVENT)
        mochaRunner = mocha.run(
          _.once(failures => {
            // register custom exception handler to catch all errors that may happen after mocha think tests are done
            process.on(UNCAUGHT_EXCEPTION_EVENT, uncaughtExceptionListener)

            // need to wait until next tick, otherwise mochaRunner = null doesn't work..
            process.nextTick(() => {
              mochaRunner = null
              if (compilationScheduler != null) {
                this.emit(MOCHA_ABORTED_EVENT)
                compilationScheduler()
                compilationScheduler = null
              } else {
                this.emit(MOCHA_FINISHED_EVENT, failures)
              }
            })
          })
        )
      } catch (err) {
        this.emit(EXCEPTION_EVENT, err)
      }
    }

    const compiler = createCompiler(config)
    registerInMemoryCompiler(compiler)
    // register webpack start callback
    compiler.hooks.watchRun.tapAsync(MOCHAPACK_NAME, (c, cb) => {
      // check if mocha tests are still running, abort them and start compiling
      if (mochaRunner) {
        compilationScheduler = () => {
          this.emit(WEBPACK_START_EVENT)
          cb()
        }

        mochaRunner.abort()
        // make sure that the current running test will be aborted when timeouts are disabled for async tests
        if (mochaRunner.currentRunnable) {
          const runnable = mochaRunner.currentRunnable
          runnable.retries(0)
          runnable.timeout(1)
          runnable.resetTimeout(1)
        }
      } else {
        this.emit(WEBPACK_START_EVENT)
        cb()
      }
    })
    // register webpack ready callback
    registerReadyCallback(
      compiler,
      (err: Error, webpackStats: Stats) => {
        this.emit(WEBPACK_READY_EVENT, err, webpackStats)
        if (err) {
          // wait for fixed tests
          return
        }
        stats = webpackStats
        runMocha()
      }
    )

    const watchCompiler: WatchCompiler = createWatchCompiler(
      compiler,
      (config as any).watchOptions
    )
    // start webpack build immediately
    watchCompiler.watch()

    // webpack enhances watch options, that's why we use them instead
    const watchOptions = watchCompiler.getWatchOptions()
    const pollingInterval =
      typeof watchOptions.poll === 'number' ? watchOptions.poll : undefined
    // create own file watcher for entry files to detect created or deleted files
    const watcher = chokidar.watch(this.entries, {
      cwd: this.cwd,
      // see https://github.com/webpack/watchpack/blob/e5305b53ac3cf2a70d49a772912b115fa77665c2/lib/DirectoryWatcher.js
      ignoreInitial: true,
      persistent: true,
      followSymlinks: false,
      ignorePermissionErrors: true,
      ignored: watchOptions.ignored,
      usePolling: watchOptions.poll ? true : undefined,
      interval: pollingInterval,
      binaryInterval: pollingInterval
    })

    const restartWebpackBuild = _.debounce(
      () => watchCompiler.watch(),
      watchOptions.aggregateTimeout
    )
    const fileDeletedOrAdded = (file, deleted) => {
      const matchesGlob = this.entries.some(pattern => minimatch(file, pattern))
      // Chokidar gives files not matching pattern sometimes, prevent this
      if (matchesGlob) {
        const filePath = path.join(this.cwd, file)
        if (deleted) {
          this.emit(ENTRY_REMOVED_EVENT, file)
          entryConfig.removeFile(filePath)
        } else {
          this.emit(ENTRY_ADDED_EVENT, file)
          entryConfig.addFile(filePath)
        }

        // pause webpack watch immediately before webpack will be notified
        watchCompiler.pause()
        // call debounced webpack runner to rebuild files
        restartWebpackBuild()
      }
    }

    // add listener for entry creation & deletion events
    watcher.on('add', file => fileDeletedOrAdded(file, false))
    watcher.on('unlink', file => fileDeletedOrAdded(file, true))

    return new Promise(() => undefined) // never ending story
  }

  private createWebpackConfig = () =>
    createWebpackConfig({
      cwd: this.cwd,
      entries: this.entries,
      entryLoaderPath,
      entryPath,
      includeLoaderPath,
      includes: this.includes,
      interactive: this.options.mochapack.interactive,
      webpackConfig: this.options.webpack.config
    })
}
