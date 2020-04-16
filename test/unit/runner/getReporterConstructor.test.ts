/* eslint-disable func-names, prefer-arrow-callback */
import { assert } from 'chai'
import spec from 'mocha/lib/reporters/spec'
import progress from 'mocha/lib/reporters/progress'

import customMochaReporter from '../../fixture/customMochaReporter'
import getReporterConstructor from '../../../src/runner/getReporterConstructor'

const customMochaReporterPath = require.resolve(
  '../../fixture/customMochaReporter'
)

describe('getReporterConstructor', function() {
  it('should allow to use reporter by function', function() {
    const reporter = getReporterConstructor(spec)
    assert.strictEqual(reporter, spec, 'should equal reporter')
  })

  it('should load built-in reporter', function() {
    const reporter = getReporterConstructor('spec')
    assert.strictEqual(reporter, spec, 'should equal built-in reporter')
  })

  it('should load reporter from node_modules', function() {
    const reporter = getReporterConstructor('mocha/lib/reporters/progress')
    assert.strictEqual(reporter, progress, 'should equal node_module reporter')
  })

  it('should load reporter relative from real cwd (1)', function() {
    const reporter = getReporterConstructor(
      './test/fixture/customMochaReporter',
      process.cwd()
    )
    assert.strictEqual(
      reporter,
      customMochaReporter as unknown,
      'should equal custom reporter'
    )
  })

  it('should load reporter relative from real cwd (2)', function() {
    const reporter = getReporterConstructor(
      'test/fixture/customMochaReporter',
      process.cwd()
    )
    assert.strictEqual(
      reporter,
      customMochaReporter as unknown,
      'should equal custom reporter'
    )
  })

  it('should load reporter with relative path from custom cwd', function() {
    const reporter = getReporterConstructor(
      '../../fixture/customMochaReporter',
      __dirname
    )
    assert.strictEqual(
      reporter,
      customMochaReporter as unknown,
      'should equal custom reporter'
    )
  })

  it('should load reporter with absolute path', function() {
    const reporter = getReporterConstructor(
      customMochaReporterPath,
      process.cwd()
    )
    assert.strictEqual(
      reporter,
      customMochaReporter as unknown,
      'should equal custom reporter'
    )
  })

  it('throws error when not found', function() {
    const load = () => {
      getReporterConstructor('xxx/xxxx/xxxx/test.js', process.cwd())
    }

    assert.throws(load, /Cannot find module/)
  })
})
