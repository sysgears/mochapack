/* eslint-env node, mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { assert } from 'chai';
import MochaWebpack from '../../lib/MochaWebpack';
import { createMochaWebpack } from '../../lib/createMochaWebpack';

describe('createMochaWebpack', function () {
  it('should create a instance of MochaWebpack', function () {
    assert.doesNotThrow(() => createMochaWebpack());
    const mochaWebpack = createMochaWebpack();

    assert.isNotNull(mochaWebpack);
    assert.instanceOf(mochaWebpack, MochaWebpack);
  });
});
