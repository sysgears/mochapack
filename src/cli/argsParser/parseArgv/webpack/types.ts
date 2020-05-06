export type WebpackMode = 'development' | 'production'

export interface ParsedWebpackArgs {
  include?: string[]
  mode?: WebpackMode
  'webpack-config'?: string
  'webpack-env'?: string
}
