import { ParsedMochaArgs } from './mocha/types'
import { ParsedWebpackArgs } from './webpack/types'
import { ParsedMochapackArgs } from './mochapack/types'

export type UndifferentiatedParsedArgs = ParsedMochaArgs &
  ParsedWebpackArgs &
  ParsedMochapackArgs

export interface ParsedArgs {
  mocha: ParsedMochaArgs
  webpack: ParsedWebpackArgs
  mochapack: ParsedMochapackArgs
}
