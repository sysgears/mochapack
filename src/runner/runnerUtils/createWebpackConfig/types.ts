import { Configuration, WebpackPluginInstance, RuleSetRule } from 'webpack'
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
  plugins: WebpackPluginInstance[]
  publicPath: string
}

export interface MochapackWebpackConfigs {
  webpackConfig: Configuration
  entryConfig: EntryConfig
}
