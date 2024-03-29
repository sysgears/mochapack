/* eslint-disable func-names, prefer-arrow-callback */

import path from 'path'
import fs from 'fs-extra'
import { assert } from 'chai'
import parseMochaOptsFile from '../../../src/cli/argsParser/optionsFromParsedArgs/mocha/parseMochaOptsFile'

const optsTestCasesPath = path.join(
  __dirname,
  'fixture',
  'config',
  'optsTestCases'
)
const optsTestCases = fs.readdirSync(optsTestCasesPath)

describe('parseMochaOptsFile', function() {
  it('returns empty object when default config file is missing', function() {
    assert.deepEqual(parseMochaOptsFile(), {})
  })

  it('throws an error when explicitly-specified default config file is missing', function() {
    const fn = () => {
      parseMochaOptsFile('mochapack.opts')
    }

    // then
    assert.throws(fn, /Options file 'mochapack.opts' not found/)
  })

  it('throws an error when specified config file is missing', function() {
    const fn = () => {
      parseMochaOptsFile('missing-config.opts')
    }

    // then
    assert.throws(fn, /Options file 'missing-config.opts' not found/)
  })

  optsTestCases.forEach(testDirName => {
    const testDirPath = path.join(optsTestCasesPath, testDirName)
    const optsFilePath = path.join(testDirPath, 'mochapack.opts')
    const expectedResultsPath = path.join(testDirPath, 'expected.json')

    it(`parses '${testDirName}/mochapack.opts' and returns options`, function() {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const expectedResult = require(expectedResultsPath)
      const parsedOptions = parseMochaOptsFile(optsFilePath)
      // Ignore interactive value
      expectedResult.mochapack.interactive = (parsedOptions as any).mochapack.interactive;

      assert.deepEqual(parsedOptions, expectedResult)
    })
  })
})
