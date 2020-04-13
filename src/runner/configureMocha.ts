import Mocha from 'mocha'
import loadReporter from './loadReporter'
import loadUI from './loadUI'
import { MochaWebpackOptions } from '../MochaWebpack'

export default function configureMocha(options: MochaWebpackOptions) {
  // infinite stack traces
  Error.stackTraceLimit = Infinity

  const mochaOptions = {
    color: !!options.colors,
    inlineDiffs: !!options.useInlineDiffs
  }

  // init mocha
  const mocha = new Mocha(mochaOptions)

  // reporter
  const reporter = loadReporter(options.reporter, options.cwd)
  mocha.reporter(reporter, options.reporterOptions)

  // slow <ms>
  mocha.suite.slow(options.slow)

  // timeout <ms>
  if (options.timeout === 0) {
    mocha.enableTimeouts(false)
  } else {
    mocha.suite.timeout(options.timeout)
  }

  // bail
  mocha.suite.bail(options.bail)

  // grep
  if (options.grep) {
    mocha.grep(new RegExp(options.grep))
  }

  // fgrep
  if (options.fgrep) {
    mocha.grep(options.fgrep)
  }

  // invert
  if (options.invert) {
    mocha.invert()
  }

  // check-leaks
  if (options.ignoreLeaks === false) {
    mocha.checkLeaks()
  }

  // full-trace
  if (options.fullStackTrace) {
    mocha.fullTrace()
  }

  // growl
  if (options.growl) {
    mocha.growl()
  }

  // async-only
  if (options.asyncOnly) {
    mocha.asyncOnly()
  }

  // delay
  if (options.delay) {
    mocha.delay()
  }

  // retries
  if (options.retries) {
    mocha.suite.retries(options.retries)
  }

  // forbid-only
  if (options.forbidOnly) {
    mocha.forbidOnly()
  }

  // interface
  const ui = loadUI(options.ui, options.cwd)
  mocha.ui(ui)

  return mocha
}
