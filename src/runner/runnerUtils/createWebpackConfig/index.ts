import { join, normalize, sep } from 'path'
import {
  flattenDeep as _flattenDeep,
  get as _get,
  has as _has,
  merge as _merge
} from 'lodash'
import { Configuration, WebpackPluginInstance, RuleSetRule } from 'webpack'
import { glob } from '../../../util/glob'
import { EntryConfig } from '../../../webpack/loader/entryLoader'
import { buildProgressPlugin } from '../../../webpack/plugin/buildProgressPlugin'
import {
  BuildLoaderRulesOptions,
  BuildWebpackConfigOptions,
  CreateWebpackConfigOptions,
  MochapackWebpackConfigs
} from './types'
import { MOCHAPACK_NAME } from '../../../util/constants'

const buildEntryConfig = async (
  entries: string[],
  cwd: string
): Promise<EntryConfig> => {
  const entryConfig = new EntryConfig()
  const files = await glob(entries, {
    cwd,
    absolute: true
  })

  files.forEach(f => entryConfig.addFile(f))
  return entryConfig
}

const makeTemporaryPath = (cwd: string): string =>
  join(cwd, '.tmp', MOCHAPACK_NAME, Date.now().toString())

const getOutputPath = (webpackConfig: Configuration, tmpPath: string): string =>
  normalize(_get(webpackConfig, 'output.path', tmpPath))

const getPublicPath = (
  webpackConfig: Configuration,
  outputPath: string
): string =>
  _has(webpackConfig, 'output.path')
    ? _get(webpackConfig, 'output.publicPath', undefined)
    : outputPath + sep

const buildPluginsArray = (
  webpackConfig: Configuration,
  interactive: boolean
): WebpackPluginInstance[] => {
  const plugins = webpackConfig.plugins || []

  if (interactive) {
    plugins.push(buildProgressPlugin())
  }

  return plugins
}

const buildLoaderRulesArray = (
  options: BuildLoaderRulesOptions
): RuleSetRule[] => {
  const {
    webpackConfig,
    entryPath,
    includeLoaderPath,
    includes,
    entryLoaderPath,
    entryConfig
  } = options
  const loaderRules = _get(webpackConfig, 'module.rules', []) as RuleSetRule[]
  loaderRules.unshift({
    test: entryPath,
    use: [
      {
        loader: includeLoaderPath,
        options: {
          include: includes
        }
      },
      {
        loader: entryLoaderPath,
        options: {
          entryConfig
        }
      }
    ]
  })
  return loaderRules
}

const buildWebpackConfig = (
  options: BuildWebpackConfigOptions
): Configuration =>
  _merge({}, options.webpackConfig, {
    entry: options.entryPath,
    module: {
      rules: options.loaderRules
    },
    output: {
      path: options.outputPath,
      publicPath: options.publicPath
    },
    plugins: options.plugins
  })

const createWebpackConfig = async (
  options: CreateWebpackConfigOptions
): Promise<MochapackWebpackConfigs> => {
  const { cwd, entries, interactive, webpackConfig } = options

  const entryConfig = await buildEntryConfig(entries, cwd)
  const tmpPath = makeTemporaryPath(cwd)
  const outputPath = getOutputPath(webpackConfig, tmpPath)
  const publicPath = getPublicPath(webpackConfig, outputPath)
  const plugins = buildPluginsArray(webpackConfig, interactive)
  const loaderRules = buildLoaderRulesArray({ ...options, entryConfig })
  const mochapackWebpackConfig = buildWebpackConfig({
    ...options,
    entryConfig,
    loaderRules,
    outputPath,
    plugins,
    publicPath
  })

  return {
    webpackConfig: mochapackWebpackConfig,
    entryConfig
  }
}

export default createWebpackConfig
