/* eslint-env node, mocha */

/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai'
import path from 'path'
import exec from './util/childProcess'

const fixtureDir = path.relative(process.cwd(), path.join(__dirname, 'fixture'))
const binPath = path.relative(process.cwd(), path.join('bin', '_mocha'))
const test = path.join(fixtureDir, 'only/simple-only.js')

describe('cli --forbid-only', function() {
  it('gets really angry if there is an only in the test', function(done) {
    exec(`node ${binPath} --mode development --forbid-only "${test}"`, err => {
      assert.isNotNull(err)
      done()
    })
  })
})
