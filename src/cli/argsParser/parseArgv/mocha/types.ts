export type MochaReporter =
  | 'base'
  | 'doc'
  | 'dot'
  | 'html'
  | 'json'
  | 'tap'
  | 'list'
  | 'spec'
  | 'nyan'
  | 'min'
  | 'xunit'
  | 'markdown'
  | 'progress'
  | 'landing'
  | 'jsonstream'

export type MochaUi = 'bdd' | 'tdd' | 'qunit' | 'exports'

export interface ParsedMochaArgs {
  'allow-uncaught'?: boolean
  'async-only'?: boolean
  bail?: boolean
  'check-leaks'?: boolean
  color?: boolean
  config?: string
  delay?: boolean
  diff: boolean
  exit?: boolean
  extension?: string[]
  fgrep?: string
  file?: string[]
  files: string[]
  'forbid-only'?: boolean
  'forbid-pending'?: boolean
  'full-trace'?: boolean
  global?: string[]
  grep?: string
  growl?: boolean
  ignore?: string[]
  'inline-diffs'?: boolean
  invert?: boolean
  'no-colors'?: boolean
  opts?: string
  package?: string
  recursive?: boolean
  reporter: MochaReporter
  'reporter-option'?: any
  require?: string[]
  retries?: number
  slow: string
  sort?: boolean
  timeout: string
  ui: MochaUi
  watch?: boolean
  'watch-files'?: string[]
  'watch-ignore'?: string[]
}
