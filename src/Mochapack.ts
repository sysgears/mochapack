import { defaults as _defaults } from 'lodash'
import TestRunner from './runner/TestRunner'
import testRunnerReporter from './runner/testRunnerReporter'
import { MochapackOptions } from './cli/argsParser/optionsFromParsedArgs/types'

export default class Mochapack {
  private options: MochapackOptions

  constructor(options: MochapackOptions) {
    this.options = options
    const { webpack } = this.options
    this.includes = webpack.include || []
    this.options = _defaults({}, this.options, this.defaultOptions)
  }

  /**
   * Current working directory of Mochapack when initialized
   */
  cwd = process.cwd()

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
   * Default options
   *
   * @private
   */
  defaultOptions = {
    mocha: {
      constructor: {
        bail: false,
        reporter: 'spec',
        reporterOptions: {},
        ui: 'bdd',
        ignoreLeaks: true,
        fullStackTrace: false,
        inlineDiffs: false,
        timeout: 2000,
        slow: 75,
        asyncOnly: false,
        delay: false,
        forbidOnly: false
      },
      cli: {
        invert: false
      }
    }
  }

  /**
   * Add file run test against
   *
   * @public
   * @param {string} file file or glob
   * @return {Mochapack}
   */
  addEntry(file: string): Mochapack {
    this.entries = [...this.entries, file]
    return this
  }

  /**
   * Add file to include into the test bundle
   *
   * @public
   * @param {string} file absolute path to module
   * @return {Mochapack}
   */
  addInclude(file: string): Mochapack {
    this.includes = [...this.includes, file]
    return this
  }

  /**
   * Builds a test runner that can be used for run or watch mode
   */
  private buildTestRunner = (): TestRunner => {
    const runner = new TestRunner(
      this.entries,
      this.includes,
      this.options,
      process.cwd()
    )
    testRunnerReporter({
      eventEmitter: runner,
      interactive: this.options.mochapack.interactive,
      quiet: this.options.mochapack.quiet,
      cwd: this.cwd,
      clearTerminal: this.options.mochapack.clearTerminal
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
