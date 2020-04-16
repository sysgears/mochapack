import { Configuration } from 'webpack'

export type WebpackConfigMode = 'production' | 'development' | 'none'

export type WebpackConfig =
  | Configuration
  | ((...args: any[]) => Promise<Configuration>)

export type ModuleDescriptor =
  | string
  | string[]
  | { module: string; register: Function }
