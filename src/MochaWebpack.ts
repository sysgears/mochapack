import { defaults as _defaults } from 'lodash'
import TestRunner from './runner/TestRunner'
import testRunnerReporter from './runner/testRunnerReporter'
import { MochapackOptions } from './cli/argsParser/optionsFromParsedArgs/types'

export type MochaWebpackOptions = {
  cwd: string
  webpackConfig: {}
  bail: boolean
  reporter: string | ReporterConstructor
  reporterOptions: {}
  ui: string
  fgrep?: string
  grep?: string | RegExp
  invert: boolean
  ignoreLeaks: boolean
  fullStackTrace: boolean
  colors?: boolean
  useInlineDiffs: boolean
  timeout: number
  retries?: number
  slow: number
  asyncOnly: boolean
  delay: boolean
  interactive: boolean
  clearTerminal: boolean
  quiet: boolean
  growl?: boolean
  forbidOnly: boolean
}

export default class MochaWebpack {
  private mochapackOptions: MochapackOptions

  constructor(options: MochapackOptions) {
    this.mochapackOptions = options
    const { mocha, webpack, mochapack } = this.mochapackOptions
    this.includes = webpack.include || []

    const providedOptions: Partial<MochaWebpackOptions> = {
      asyncOnly: mocha.constructor.asyncOnly,
      bail: mocha.constructor.bail,
      clearTerminal: mochapack.clearTerminal,
      colors: mocha.constructor.useColors,
      cwd: process.cwd(),
      delay: mocha.constructor.delay,
      forbidOnly: mocha.constructor.forbidOnly,
      fullStackTrace: mocha.constructor.fullStackTrace,
      growl: mocha.constructor.growl,
      ignoreLeaks: mocha.constructor.ignoreLeaks,
      interactive: mochapack.interactive,
      invert: mocha.cli.invert,
      quiet: mochapack.quiet,
      reporter: mocha.constructor.reporter,
      reporterOptions: mocha.constructor.reporterOptions,
      retries: mocha.constructor.retries,
      slow: mocha.constructor.slow,
      timeout: mocha.constructor.timeout,
      ui: mocha.constructor.ui,
      useInlineDiffs: mocha.constructor.inlineDiffs
    }

    this.options = _defaults({}, providedOptions, this.options)
  }
  /**
   * Files to run test against
   *
   * @private
   */
  entries: Array<string> = []

  /**
   * Files to include into the bundle
   *
   * @private
   */
  includes: Array<string> = []

  /**
   * Options
   *
   * @private
   */
  options: MochaWebpackOptions = {
    cwd: process.cwd(),
    webpackConfig: {},
    bail: false,
    reporter: 'spec',
    reporterOptions: {},
    ui: 'bdd',
    invert: false,
    ignoreLeaks: true,
    fullStackTrace: false,
    useInlineDiffs: false,
    timeout: 2000,
    slow: 75,
    asyncOnly: false,
    delay: false,
    interactive: !!(process.stdout as any).isTTY,
    clearTerminal: false,
    quiet: false,
    forbidOnly: false
  }

  /**
   * Add file run test against
   *
   * @public
   * @param {string} file file or glob
   * @return {MochaWebpack}
   */
  addEntry(file: string): MochaWebpack {
    this.entries = [...this.entries, file]
    return this
  }

  /**
   * Add file to include into the test bundle
   *
   * @public
   * @param {string} file absolute path to module
   * @return {MochaWebpack}
   */
  addInclude(file: string): MochaWebpack {
    this.includes = [...this.includes, file]
    return this
  }

  /**
   * Sets the webpack config
   *
   * @public
   * @param {Object} config webpack config
   * @return {MochaWebpack}
   */

  webpackConfig(config: {} = {}): MochaWebpack {
    this.options = {
      ...this.options,
      webpackConfig: config
    }
    return this
  }

  /**
   * Only run tests containing <string>
   *
   * @public
   * @param {string} str
   * @return {MochaWebpack}
   */
  fgrep(str: string): MochaWebpack {
    this.options = {
      ...this.options,
      fgrep: str
    }
    return this
  }

  /**
   * Only run tests matching <pattern>
   *
   * @public
   * @param {string|RegExp} pattern
   * @return {MochaWebpack}
   */
  grep(pattern: string | RegExp): MochaWebpack {
    this.options = {
      ...this.options,
      grep: pattern
    }
    return this
  }

  /**
   * Builds a test runner that can be used for run or watch mode
   */
  private buildTestRunner = (): TestRunner => {
    const runner = new TestRunner(this.entries, this.includes, this.options)
    testRunnerReporter({
      eventEmitter: runner,
      interactive: this.options.interactive,
      quiet: this.options.quiet,
      cwd: this.options.cwd,
      clearTerminal: this.options.clearTerminal
    })
    return runner
  }

  /**
   * Run tests
   *
   * @public
   * @return {Promise<number>} a Promise that gets resolved with the number of failed tests or rejected with build error
   */
  async run(): Promise<number> {
    return this.buildTestRunner().run()
  }

  /**
   * Run tests and rerun them on changes
   * @public
   */
  async watch(): Promise<void> {
    await this.buildTestRunner().watch()
  }
}
