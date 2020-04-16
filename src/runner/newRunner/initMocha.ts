import Mocha, { MochaOptions } from 'mocha'
import getReporterConstructor from '../getReporterConstructor'
import { MochapackMochaOptions } from '../../cli/argsParser/optionsFromParsedArgs/types'
import loadUI from '../loadUI'

/**
 * Uses the options set on the instance of Mocha to set its reporter for
 *   Mochapack
 */
const setReporterInMochaOptions = (mocha: Mocha, cwd: string) => {
  const reporter = getReporterConstructor(mocha.options.reporter, cwd)
  mocha.reporter(reporter, mocha.options.reporterOptions)
}

/**
 * Uses the options set on the instance of Mocha to set its UI for Mochapack
 */
const setUiInMochaOptions = (mocha: Mocha, cwd: string) => {
  const ui = loadUI(mocha.options.ui, cwd)
  mocha.ui(ui)
}

/**
 * Initializes an instance of Mocha on behalf of the user with their provided
 *   options
 */
const initMocha = (options: MochapackMochaOptions, cwd: string): Mocha => {
  const mochaInstance = new Mocha(options.constructor)

  if (options.cli.invert) mochaInstance.invert()
  setReporterInMochaOptions(mochaInstance, cwd)
  setUiInMochaOptions(mochaInstance, cwd)

  return mochaInstance
}

export default initMocha
