/* eslint-disable func-names, prefer-arrow-callback, max-len */
import { assert } from 'chai'
import MochaWebpack from '../../src/MochaWebpack'
import { MochapackOptions } from '../../src/cli/argsParser/optionsFromParsedArgs/types'

describe('MochaWebpack', function() {
  const basicOptions: MochapackOptions = {
    mocha: {
      cli: {
        extension: [],
        watchIgnore: []
      },
      constructor: {}
    },
    webpack: {
      config: ''
    },
    mochapack: {
      interactive: true,
      clearTerminal: false
    }
  }
  it('should create a instance of MochaWebpack', function() {
    assert.doesNotThrow(() => new MochaWebpack(basicOptions))
    const mochaWebpack = new MochaWebpack(basicOptions)

    assert.isNotNull(mochaWebpack)
  })

  it('has some default options', function() {
    const mochaWebpack = new MochaWebpack(basicOptions)
    assert.isObject(mochaWebpack.options)

    const expected = {
      cwd: process.cwd(),
      webpackConfig: {},
      bail: false,
      colors: undefined,
      reporter: 'spec',
      reporterOptions: {},
      retries: undefined,
      ui: 'bdd',
      invert: false,
      ignoreLeaks: true,
      fullStackTrace: false,
      growl: undefined,
      useInlineDiffs: false,
      timeout: 2000,
      slow: 75,
      asyncOnly: false,
      delay: false,
      interactive: !!process.stdout.isTTY,
      clearTerminal: false,
      quiet: false,
      forbidOnly: false
    }
    assert.deepEqual(mochaWebpack.options, expected)
  })

  it('has a list of entries', function() {
    const mochaWebpack = new MochaWebpack(basicOptions)
    assert.isArray(mochaWebpack.entries)
    assert.lengthOf(mochaWebpack.entries, 0)
  })

  it('has a list of includes', function() {
    const mochaWebpack = new MochaWebpack(basicOptions)
    assert.isArray(mochaWebpack.includes)
    assert.lengthOf(mochaWebpack.includes, 0)
  })

  context('methods', function() {
    beforeEach(function() {
      this.mochaWebpack = new MochaWebpack(basicOptions)
    })

    it('addEntry()', function() {
      const oldEntries = this.mochaWebpack.entries
      const entry = './test.js'

      const returnValue = this.mochaWebpack.addEntry(entry)

      assert.include(this.mochaWebpack.entries, entry, 'entry should be added')
      assert.notStrictEqual(
        this.mochaWebpack.entries,
        oldEntries,
        'addEntry() should not mutate'
      )
      assert.strictEqual(
        returnValue,
        this.mochaWebpack,
        'api should be chainable'
      )
    })

    it('webpackConfig()', function() {
      const oldOptions = this.mochaWebpack.options
      const webpackConfig = {
        loaders: []
      }

      const returnValue = this.mochaWebpack.webpackConfig(webpackConfig)

      assert.propertyVal(
        this.mochaWebpack.options,
        'webpackConfig',
        webpackConfig,
        'webpackConfig should be changed'
      )
      assert.notStrictEqual(
        this.mochaWebpack.options,
        oldOptions,
        'webpackConfig() should not mutate'
      )
      assert.strictEqual(
        returnValue,
        this.mochaWebpack,
        'api should be chainable'
      )
    })

    it('fgrep()', function() {
      const oldOptions = this.mochaWebpack.options
      const fgrep = 'fgrep'

      const returnValue = this.mochaWebpack.fgrep(fgrep)

      assert.propertyVal(
        this.mochaWebpack.options,
        'fgrep',
        fgrep,
        'fgrep should be changed'
      )
      assert.notStrictEqual(
        this.mochaWebpack.options,
        oldOptions,
        'fgrep() should not mutate'
      )
      assert.strictEqual(
        returnValue,
        this.mochaWebpack,
        'api should be chainable'
      )
    })

    it('grep()', function() {
      const oldOptions = this.mochaWebpack.options
      const grep = 'grep'

      const returnValue = this.mochaWebpack.grep(grep)

      assert.propertyVal(
        this.mochaWebpack.options,
        'grep',
        grep,
        'grep should be changed'
      )
      assert.notStrictEqual(
        this.mochaWebpack.options,
        oldOptions,
        'grep() should not mutate'
      )
      assert.strictEqual(
        returnValue,
        this.mochaWebpack,
        'api should be chainable'
      )
    })
  })
})
