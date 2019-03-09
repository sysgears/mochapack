var expect = require('expect.js');

describe('Package works', function() {
  it('key existence test', function() {
    expect({ a: 'b' }).to.have.key('a');
  });

  it('length test', function() {
    expect([]).to.have.length(0);
  });
});
