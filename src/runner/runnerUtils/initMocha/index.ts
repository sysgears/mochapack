import { cloneDeep as _cloneDeep } from 'lodash'
import Mocha from 'mocha'
import getReporterConstructor from './getReporterConstructor'
import { MochapackMochaOptions } from '../../../cli/argsParser/optionsFromParsedArgs/types'
import loadUI from './loadUI'

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
const setUiInMochaOptions = (mocha: Mocha, ui: string, cwd: string) => {
  mocha.ui(loadUI(ui, cwd))
}

/**
 * Adds specified files to the instance of Mocha
 */
const addFilesToMochaInstance = (mocha: Mocha, files?: string[]): Mocha => {
  let clonedMocha = _cloneDeep(mocha)
  if (files) {
    files.forEach(file => {
      clonedMocha = clonedMocha.addFile(file)
    })
  }
  return clonedMocha
}

/**
 * Initializes an instance of Mocha on behalf of the user with their provided
 *   options
 */
const initMocha = (options: MochapackMochaOptions, cwd: string): Mocha => {
  let mochaInstance = new Mocha(options.constructor)
  mochaInstance = addFilesToMochaInstance(mochaInstance, options.cli.file)
  if (options.cli.invert) mochaInstance.invert()
  setReporterInMochaOptions(mochaInstance, cwd)
  setUiInMochaOptions(mochaInstance, options.constructor.ui, cwd)

  return mochaInstance
}

export default initMocha
