import { normalize } from 'path'
import loaderUtils from 'loader-utils'
import createEntry from '../util/createEntry'

export class EntryConfig {
  files: Array<string>

  constructor() {
    this.files = []
  }

  addFile(file: string): void {
    const normalizedFile = normalize(file)
    this.files.push(normalizedFile)
  }

  removeFile(file: string): void {
    const normalizedFile = normalize(file)
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


  const entries = config.getFiles()

  // add all entries as dependencies
  // note this.addDependency requires an absolute path
  entries.forEach(e => this.addDependency(e))

  // build source code
  const dependencies = entries.map(file => loaderUtils.stringifyRequest(this, file))
  const sourceCode: string = createEntry(dependencies)

  this.callback(null, sourceCode, null)
}

export default entryLoader
