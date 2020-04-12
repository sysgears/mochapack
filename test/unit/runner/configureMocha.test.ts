/* eslint-env node, mocha */

/* eslint-disable func-names, prefer-arrow-callback */
import { assert } from 'chai'
import { sandbox } from 'sinon'
import Mocha from 'mocha'

import configureMocha from '../../../src/runner/configureMocha'

describe('configureMocha', function() {
  beforeEach(function() {
    this.options = {
      bail: false,
      reporter: 'spec',
      reporterOptions: {},
      ui: 'bdd',
      invert: false,
      ignoreLeaks: true,
      fullStackTrace: false,
      useInlineDiffs: false,
      timeout: 2000,
      slow: 75,
      asyncOnly: false,
      delay: false,
      forbidOnly: true
    }
    this.sandbox = sandbox.create()
    this.spyReporter = this.sandbox.spy(Mocha.prototype, 'reporter')
    this.spyColor = this.sandbox.spy(Mocha.prototype, 'color')
    this.spyInlineDiffs = this.sandbox.spy(Mocha.prototype, 'inlineDiffs')
    this.spyEnableTimeouts = this.sandbox.spy(Mocha.prototype, 'enableTimeouts')
    this.spyGrep = this.sandbox.spy(Mocha.prototype, 'grep')
    this.spyGrowl = this.sandbox.spy(Mocha.prototype, 'growl')
    this.spyForbidOnly = this.sandbox.spy(Mocha.prototype, 'forbidOnly')
  })

  afterEach(function() {
    this.sandbox.restore()
  })

  it('should create a instance of Mocha', function() {
    const mocha = configureMocha(this.options)
    assert.instanceOf(
      mocha,
      Mocha,
      'configureMocha should return a instance of Mocha'
    )
  })

  it('should call reporter()', function() {
    configureMocha({
      ...this.options
    })

    const reporter = Mocha.reporters[this.options.reporter]

    assert.isTrue(this.spyReporter.called, 'reporter() should be called')
    assert.isTrue(
      this.spyReporter.calledWith(reporter, this.options.reporterOptions)
    )
  })

  it('should set color', function() {
    var mocha = configureMocha({
      ...this.options,
      colors: undefined
    })

    assert.isFalse(mocha.options.color)

    mocha = configureMocha({
      ...this.options,
      colors: true
    })

    assert.isTrue(mocha.options.color)
  })

  it('should set inlineDiffs', function() {
    var mocha = configureMocha({
      ...this.options,
      useInlineDiffs: undefined
    })

    assert.isFalse(mocha.options.inlineDiffs)

    mocha = configureMocha({
      ...this.options,
      useInlineDiffs: true
    })

    assert.isTrue(mocha.options.inlineDiffs)
  })

  it('should call enableTimeouts()', function() {
    configureMocha({
      ...this.options,
      timeout: 0
    })

    assert.isTrue(
      this.spyEnableTimeouts.called,
      'enableTimeouts() should be called'
    )
    assert.isTrue(this.spyEnableTimeouts.calledWith(false))
  })

  it('should call grep()', function() {
    configureMocha({
      ...this.options,
      grep: 'dddd',
      fgrep: 'dddd'
    })

    assert.isTrue(this.spyGrep.called, 'grep() should be called')
  })

  it('should set growl', function() {
    configureMocha({
      ...this.options,
      growl: undefined
    })

    assert.isFalse(this.spyGrowl.called, 'growl() should not be called')

    configureMocha({
      ...this.options,
      growl: true
    })

    assert.isTrue(this.spyGrowl.called, 'growl() should be called')
  })

  it('should call forbidOnly()', function() {
    configureMocha({
      ...this.options,
      timeout: 0
    })

    assert.isTrue(this.spyForbidOnly.called, 'spyForbidOnly() should be called')
  })
})
