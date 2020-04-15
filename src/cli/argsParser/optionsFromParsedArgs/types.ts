import { MochaOptions } from 'mocha'

export interface MochaCliOptions {
  config?: string
  exit?: boolean
  extension: string[]
  file?: string[]
  ignore?: string[]
  invert?: boolean
  package?: string
  recursive?: boolean
  reporterOption?: any
  sort?: boolean
  watch?: boolean
  watchFiles?: string[]
  watchIgnore: string[]
}

export interface MochapackMochaOptions {
  constructor: MochaOptions
  cli: MochaCliOptions
}

export interface MochapackWebpackOptions {}

export interface MochapackSpecificOptions {}

export interface MochapackOptions {
  mocha: MochapackMochaOptions
  webpack: MochapackWebpackOptions
  mochapack: MochapackSpecificOptions
}
