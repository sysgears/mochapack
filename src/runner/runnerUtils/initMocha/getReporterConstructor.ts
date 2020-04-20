import path from 'path'
import {
  isFunction as _isFunction,
  isString as _isString,
  isUndefined as _isUndefined
} from 'lodash'
import { reporters, ReporterConstructor } from 'mocha'

const getReporterConstructor = (
  reporter: string | ReporterConstructor,
  cwd?: string
): ReporterConstructor | null => {
  // If reporter is already loaded, just return it
  if (_isFunction(reporter)) return reporter as ReporterConstructor

  // Try to load built-in reporter like 'spec'
  if (!_isUndefined(reporters[reporter as string]))
    return reporters[reporter as string]

  let loadedReporter = null

  try {
    // Try to load reporter from node_modules
    // eslint-disable-next-line global-require, import/no-dynamic-require
    loadedReporter = require(reporter as string)
  } catch (e) {
    // Try to load reporter from cwd
    // eslint-disable-next-line global-require, import/no-dynamic-require
    loadedReporter = require(path.resolve(cwd, reporter as string))
  }
  return loadedReporter
}

export default getReporterConstructor
