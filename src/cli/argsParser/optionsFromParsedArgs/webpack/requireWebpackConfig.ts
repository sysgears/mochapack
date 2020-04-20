import { existsSync } from 'fs'
import { resolve, extname, dirname, basename } from 'path'
import interpret from 'interpret'
import {
  isArray as _isArray,
  isFunction as _isFunction,
  isString as _isString,
  isUndefined as _isUndefined
} from 'lodash'
import { Configuration } from 'webpack'
import {
  ModuleDescriptor,
  WebpackConfig,
  WebpackConfigMode
} from '../../../types'

/**
 * Ensures that .js extension comes first, or whichever extension is shorter
 */
const sortExtensions = (ext1: string, ext2: string): number => {
  if (ext1 === '.js') return -1
  if (ext2 === '.js') return 1
  return ext1.length - ext2.length
}

const extensions = Object.keys(interpret.extensions).sort(sortExtensions)

const findConfigFile = (dirPath: string, baseName: string): string | null => {
  for (const extension of extensions) {
    const filePath = resolve(dirPath, `${baseName}${extension}`)
    if (existsSync(filePath)) return filePath
  }
  return null
}

const getConfigExtension = (configPath: string): string => {
  for (const extension of extensions.reverse()) {
    const configPathIncludesExtension =
      configPath.indexOf(extension, configPath.length - extension.length) > -1

    if (configPathIncludesExtension) return extension
  }
  return extname(configPath)
}

/**
 * Registers a compiler
 */
const registerCompiler = (moduleDescriptor: ModuleDescriptor): void => {
  if (!moduleDescriptor) return

  if (_isString(moduleDescriptor)) {
    require(moduleDescriptor) // eslint-disable-line global-require, import/no-dynamic-require
  } else if (!_isArray(moduleDescriptor)) {
    const module = require(moduleDescriptor.module) // eslint-disable-line global-require, import/no-dynamic-require
    moduleDescriptor.register(module)
  } else {
    for (const descriptor of moduleDescriptor) {
      try {
        registerCompiler(descriptor)
        break
      } catch (e) {
        if (!e.message.includes('Cannot find module')) throw e
      }
    }
  }
}

/**
 * Determines the path to a config that requires precompile and registers the
 *   compiler
 */
const requireWithPrecompilerPath = (
  configPath: string,
  configExtension: string
): string | undefined => {
  const configDirPath = dirname(configPath)
  const configBaseName = basename(configPath, configExtension)
  const configPathPrecompiled = findConfigFile(configDirPath, configBaseName)
  if (configPathPrecompiled != null) {
    // Found a config that needs to be precompiled
    const configExtensionPrecompiled = getConfigExtension(configPathPrecompiled)
    // Register compiler
    registerCompiler(interpret.extensions[configExtensionPrecompiled])
    return configPathPrecompiled
  }

  return undefined
}

/**
 * Finds the Webpack config if available and registers the compiler according
 *   to the applicable extension
 */
const findConfig = (
  configPath: string,
  configExtension: string
): WebpackConfig | undefined => {
  let config: WebpackConfig | undefined
  let requirePath: string
  let configFound = false

  if (existsSync(configPath)) {
    // Config exists, register compiler for non-js extensions
    registerCompiler(interpret.extensions[configExtension])
    requirePath = configPath
    configFound = true
  } else if (configExtension === '.js') {
    // Config does not exist, check for config that requires precompile
    requirePath = requireWithPrecompilerPath(configPath, configExtension)
    configFound = !_isUndefined(requirePath)
  }

  if (configFound) {
    config = require(requirePath) // eslint-disable-line global-require, import/no-dynamic-require
  }

  return config
}

/**
 * Requires in the user's Webpack config
 */
const requireWebpackConfig = async (
  webpackConfig: string,
  required?: boolean,
  env?: string,
  mode?: WebpackConfigMode
): Promise<Configuration> => {
  const configPath = resolve(webpackConfig)
  const configExtension = getConfigExtension(configPath)
  const foundConfig = findConfig(configPath, configExtension)

  if (_isUndefined(foundConfig) && required)
    throw new Error(`Webpack config could not be found: ${webpackConfig}`)

  let config: WebpackConfig = foundConfig
    ? (foundConfig as { default: WebpackConfig }).default || foundConfig
    : {}
  if (_isFunction(config)) config = await Promise.resolve(config(env))
  if (_isArray(config)) {
    throw new Error(
      'Passing multiple configs as an Array is not supported. Please provide a single config instead.'
    )
  }

  if (mode != null) config.mode = mode

  return config
}

export default requireWebpackConfig
