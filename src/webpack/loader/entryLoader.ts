import loaderUtils from 'loader-utils'
import normalizePath from 'normalize-path'
import createEntry from '../util/createEntry'

export class EntryConfig {
  files: Array<string>

  constructor() {
    this.files = []
  }

  addFile(file: string): void {
    const normalizedFile = normalizePath(file)
    this.files.push(normalizedFile)
  }

  removeFile(file: string): void {
    const normalizedFile = normalizePath(file)
    this.files = this.files.filter(f => f !== normalizedFile)
  }

  getFiles(): Array<string> {
    return this.files
  }
}

export const entryLoader = function entryLoader() {
  const loaderOptions = loaderUtils.getOptions(this)
  const config: EntryConfig = loaderOptions.entryConfig

  // Remove all dependencies of the loader result
  this.clearDependencies()

  const dependencies: Array<string> = config
    .getFiles()
    .map(file => loaderUtils.stringifyRequest(this, file))

  // add all entries as dependencies
  dependencies.forEach(this.addDependency.bind(this))

  // build source code
  const sourceCode: string = createEntry(dependencies)

  this.callback(null, sourceCode, null)
}

export default entryLoader
