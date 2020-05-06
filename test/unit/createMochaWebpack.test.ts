/* eslint-disable func-names, prefer-arrow-callback */
import { assert } from 'chai'
import Mochapack from '../../src/Mochapack'
import createMochapack from '../../src/createMochapack'
import { MochapackOptions } from '../../src/cli/argsParser/optionsFromParsedArgs/types'

describe('createMochapack', function() {
  it('should create a instance of Mochapack', function() {
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

    assert.doesNotThrow(() => createMochapack(basicOptions))
    const mochaWebpack = createMochapack(basicOptions)

    assert.isNotNull(mochaWebpack)
    assert.instanceOf(mochaWebpack, Mochapack)
  })
})
