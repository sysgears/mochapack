import {
  Configuration,
  WebpackPluginInstance,
  Compiler,
  RuleSetRule
} from 'webpack'
import { EntryConfig } from '../../../webpack/loader/entryLoader'

export interface CreateWebpackConfigOptions {
  cwd: string
  entries: string[]
  entryLoaderPath: string
  entryPath: string
  includeLoaderPath: string
  includes: string[]
  interactive: boolean
  webpackConfig: Configuration
}

export interface BuildLoaderRulesOptions extends CreateWebpackConfigOptions {
  entryConfig: EntryConfig
}

export interface BuildWebpackConfigOptions extends BuildLoaderRulesOptions {
  loaderRules: RuleSetRule[]
  outputPath: string
  plugins: (
    | false
    | ''
    | 0
    | WebpackPluginInstance
    | ((this: Compiler, compiler: Compiler) => void)
  )[]
  publicPath: string
}

export interface MochapackWebpackConfigs {
  webpackConfig: Configuration
  entryConfig: EntryConfig
}
