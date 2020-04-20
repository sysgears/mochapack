/* eslint-disable func-names, prefer-arrow-callback */
import { assert } from 'chai'
import MochaWebpack from '../../src/MochaWebpack'
import createMochaWebpack from '../../src/createMochaWebpack'
import { MochapackOptions } from '../../src/cli/argsParser/optionsFromParsedArgs/types'

describe('createMochaWebpack', function() {
  it('should create a instance of MochaWebpack', function() {
    const basicOptions: MochapackOptions = {
      mocha: {
        cli: {
          extension: [],
          files: [],
          watchIgnore: []
        },
        constructor: {}
      },
      webpack: {
        config: {}
      },
      mochapack: {
        interactive: false,
        clearTerminal: true
      }
    }

    assert.doesNotThrow(() => createMochaWebpack(basicOptions))
    const mochaWebpack = createMochaWebpack(basicOptions)

    assert.isNotNull(mochaWebpack)
    assert.instanceOf(mochaWebpack, MochaWebpack)
  })
})
