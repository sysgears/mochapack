import { expect } from 'chai'
import { isUndefined as _isUndefined, merge as _merge } from 'lodash'

import parseArgv from '.'
import mochaOptions from './mocha/mochaOptions'
import mochapackOptions, {
  mochapackDefaults
} from './mochapack/mochapackOptions'
import webpackOptions from './webpack/webpackOptions'

describe('parseArgv', () => {
  let argv: string[]

  const mochaDefaults = {
    diff: true,
    files: ['./test'],
    reporter: 'spec',
    slow: 75,
    timeout: 2000,
    ui: 'bdd'
  }

  const mochaDefaultExtension = ['js', 'cjs', 'mjs']
  const mochaDefaultWatchIgnore = ['node_modules', '.git']
  const mochaFullDefaults = _merge({}, mochaDefaults, {
    extension: mochaDefaultExtension,
    'watch-ignore': mochaDefaultWatchIgnore
  })

  beforeEach(() => {
    argv = ['src']
  })

  context('when handling arguments for Mocha', () => {
    context('when no files to test are specified', () => {
      it('assumes tests are in `test/`', () => {
        const parsedMochaArgs = parseArgv([]).mocha
        expect(parsedMochaArgs.files).to.eql(['./test'])
      })
    })

    context('when files to test are specified', () => {
      it('properly determines the array of files', () => {
        const parsedMochaArgs = parseArgv(['fileA.js', 'fileB.js']).mocha
        expect(parsedMochaArgs.files).to.eql(['fileA.js', 'fileB.js'])
      })
    })

    const mochaArgs = [
      {
        argumentName: 'allow-uncaught',
        scenarios: [
          {
            provided: ['--allow-uncaught'],
            expected: { mocha: { 'allow-uncaught': true } }
          },
          {
            provided: ['--allow-uncaught=false'],
            expected: { mocha: { 'allow-uncaught': false } }
          }
        ]
      },
      {
        argumentName: 'async-only',
        scenarios: [
          {
            provided: ['--async-only'],
            expected: { mocha: { 'async-only': true } }
          },
          {
            provided: ['-A'],
            expected: { mocha: { 'async-only': true } }
          },
          {
            provided: ['--async-only=false'],
            expected: { mocha: { 'async-only': false } }
          }
        ]
      },
      {
        argumentName: 'bail',
        scenarios: [
          {
            provided: ['--bail'],
            expected: { mocha: { bail: true } }
          },
          {
            provided: ['-b'],
            expected: { mocha: { bail: true } }
          },
          {
            provided: ['--bail=false'],
            expected: { mocha: { bail: false } }
          }
        ]
      },
      {
        argumentName: 'check-leaks',
        scenarios: [
          {
            provided: ['--check-leaks'],
            expected: { mocha: { 'check-leaks': true } }
          },
          {
            provided: ['--check-leaks=false'],
            expected: { mocha: { 'check-leaks': false } }
          }
        ]
      },
      {
        argumentName: 'color',
        scenarios: [
          {
            provided: ['--color'],
            expected: { mocha: { color: true } }
          },
          {
            provided: ['--colors'],
            expected: { mocha: { color: true } }
          },
          {
            provided: ['-c'],
            expected: { mocha: { color: true } }
          },
          {
            provided: ['--color=false'],
            expected: { mocha: { color: false } }
          }
        ]
      },
      {
        argumentName: 'config',
        scenarios: [
          {
            provided: ['--config', 'test/fixture/testConfig.json'],
            expected: {
              mocha: { config: 'test/fixture/testConfig.json' }
            }
          }
        ]
      },
      {
        argumentName: 'delay',
        scenarios: [
          {
            provided: ['--delay'],
            expected: { mocha: { delay: true } }
          },
          {
            provided: ['--delay=false'],
            expected: { mocha: { delay: false } }
          }
        ]
      },
      {
        argumentName: 'diff',
        scenarios: [
          {
            provided: ['--diff'],
            expected: { mocha: { diff: true } }
          },
          {
            provided: ['--diff=false'],
            expected: { mocha: { diff: false } }
          }
        ]
      },
      {
        argumentName: 'exit',
        scenarios: [
          {
            provided: ['--exit'],
            expected: { mocha: { exit: true } }
          },
          {
            provided: ['--exit=false'],
            expected: { mocha: { exit: false } }
          }
        ]
      },
      {
        argumentName: 'extension',
        scenarios: [
          {
            provided: ['--extension', 'ts'],
            expected: { mocha: { extension: ['ts'] } }
          }
        ]
      },
      {
        argumentName: 'fgrep',
        scenarios: [
          {
            provided: ['--fgrep', 'test.js'],
            expected: { mocha: { fgrep: 'test.js' } }
          },
          {
            provided: ['-f', 'test.js'],
            expected: { mocha: { fgrep: 'test.js' } }
          }
        ]
      },
      {
        argumentName: 'file',
        scenarios: [
          {
            provided: ['--file', 'init.js'],
            expected: { mocha: { file: ['init.js'] } }
          }
        ]
      },
      {
        argumentName: 'forbid-only',
        scenarios: [
          {
            provided: ['--forbid-only'],
            expected: { mocha: { 'forbid-only': true } }
          },
          {
            provided: ['--forbid-only=false'],
            expected: { mocha: { 'forbid-only': false } }
          }
        ]
      },
      {
        argumentName: 'forbid-pending',
        scenarios: [
          {
            provided: ['--forbid-pending'],
            expected: { mocha: { 'forbid-pending': true } }
          },
          {
            provided: ['--forbid-pending=false'],
            expected: { mocha: { 'forbid-pending': false } }
          }
        ]
      },
      {
        argumentName: 'full-trace',
        scenarios: [
          {
            provided: ['--full-trace'],
            expected: { mocha: { 'full-trace': true } }
          },
          {
            provided: ['--full-trace=false'],
            expected: { mocha: { 'full-trace': false } }
          }
        ]
      },
      {
        argumentName: 'global',
        scenarios: [
          {
            provided: ['--global', 'myGlobal'],
            expected: { mocha: { global: ['myGlobal'] } }
          },
          {
            provided: ['--globals', 'myGlobal'],
            expected: { mocha: { global: ['myGlobal'] } }
          }
        ]
      },
      {
        argumentName: 'grep',
        scenarios: [
          {
            provided: ['--grep', 'test.js'],
            expected: { mocha: { grep: 'test.js' } }
          },
          {
            provided: ['-g', 'test.js'],
            expected: { mocha: { grep: 'test.js' } }
          }
        ]
      },
      {
        argumentName: 'growl',
        scenarios: [
          {
            provided: ['--growl'],
            expected: { mocha: { growl: true } }
          },
          {
            provided: ['-G'],
            expected: { mocha: { growl: true } }
          },
          {
            provided: ['--growl=false'],
            expected: { mocha: { growl: false } }
          }
        ]
      },
      {
        argumentName: 'ignore',
        scenarios: [
          {
            provided: ['--ignore', 'unimportant.js'],
            expected: { mocha: { ignore: ['unimportant.js'] } }
          },
          {
            provided: ['--exclude', 'unimportant.js'],
            expected: { mocha: { ignore: ['unimportant.js'] } }
          }
        ]
      },
      {
        argumentName: 'inline-diffs',
        scenarios: [
          {
            provided: ['--inline-diffs'],
            expected: { mocha: { 'inline-diffs': true } }
          },
          {
            provided: ['--inline-diffs=false'],
            expected: { mocha: { 'inline-diffs': false } }
          }
        ]
      },
      {
        argumentName: 'invert',
        scenarios: [
          {
            provided: ['--invert', '--grep', 'test.js'],
            expected: { mocha: { invert: true, grep: 'test.js' } }
          },
          {
            provided: ['-i', '--grep', 'test.js'],
            expected: { mocha: { invert: true, grep: 'test.js' } }
          },
          {
            provided: ['--invert=false', '--grep', 'test.js'],
            expected: { mocha: { invert: false, grep: 'test.js' } }
          }
        ]
      },
      {
        argumentName: 'no-colors',
        scenarios: [
          {
            provided: ['--no-colors'],
            expected: { mocha: { color: false } }
          },
          {
            provided: ['-C'],
            expected: { mocha: { 'no-colors': true } }
          },
          {
            provided: ['--no-colors=false'],
            expected: { mocha: { 'no-colors': false } }
          }
        ]
      },
      {
        argumentName: 'package',
        scenarios: [
          {
            provided: ['--package', 'pkg.json'],
            expected: { mocha: { package: 'pkg.json' } }
          }
        ]
      },
      {
        argumentName: 'recursive',
        scenarios: [
          {
            provided: ['--recursive'],
            expected: { mocha: { recursive: true } }
          },
          {
            provided: ['--recursive=false'],
            expected: { mocha: { recursive: false } }
          }
        ]
      },
      {
        argumentName: 'reporter',
        scenarios: [
          {
            provided: ['--reporter', 'min'],
            expected: { mocha: { reporter: 'min' } }
          },
          {
            provided: ['-R', 'min'],
            expected: { mocha: { reporter: 'min' } }
          }
        ]
      },
      {
        argumentName: 'reporter-option',
        scenarios: [
          {
            provided: ['--reporter-option', 'foo=bar,isLegit,hello=world'],
            expected: {
              mocha: {
                'reporter-option': { foo: 'bar', isLegit: true, hello: 'world' }
              }
            }
          },
          {
            provided: ['--reporter-options', 'foo=bar,isLegit,hello=world'],
            expected: {
              mocha: {
                'reporter-option': { foo: 'bar', isLegit: true, hello: 'world' }
              }
            }
          },
          {
            provided: ['-O', 'foo=bar,isLegit,hello=world'],
            expected: {
              mocha: {
                'reporter-option': { foo: 'bar', isLegit: true, hello: 'world' }
              }
            }
          }
        ]
      },
      {
        argumentName: 'require',
        scenarios: [
          {
            provided: ['--require', 'test/fixture/required.js'],
            expected: { mocha: { require: ['test/fixture/required.js'] } }
          },
          {
            provided: ['-r', 'test/fixture/required.js'],
            expected: { mocha: { require: ['test/fixture/required.js'] } }
          }
        ]
      },
      {
        argumentName: 'retries',
        scenarios: [
          {
            provided: ['--retries', 700],
            expected: { mocha: { retries: 700 } }
          }
        ]
      },
      {
        argumentName: 'slow',
        scenarios: [
          {
            provided: ['--slow', 20000],
            expected: { mocha: { slow: '20000' } }
          },
          {
            provided: ['-s', 20000],
            expected: { mocha: { slow: '20000' } }
          }
        ]
      },
      {
        argumentName: 'sort',
        scenarios: [
          {
            provided: ['--sort'],
            expected: { mocha: { sort: true } }
          },
          {
            provided: ['-S'],
            expected: { mocha: { sort: true } }
          },
          {
            provided: ['--sort=false'],
            expected: { mocha: { sort: false } }
          }
        ]
      },
      {
        argumentName: 'timeout',
        scenarios: [
          {
            provided: ['--timeout', 3000],
            expected: { mocha: { timeout: '3000' } }
          },
          {
            provided: ['--timeouts', 3000],
            expected: { mocha: { timeout: '3000' } }
          },
          {
            provided: ['-t', 3000],
            expected: { mocha: { timeout: '3000' } }
          }
        ]
      },
      {
        argumentName: 'ui',
        scenarios: [
          { provided: ['--ui', 'tdd'], expected: { mocha: { ui: 'tdd' } } },
          { provided: ['-u', 'tdd'], expected: { mocha: { ui: 'tdd' } } }
        ]
      },
      {
        argumentName: 'watch',
        scenarios: [
          {
            provided: ['--watch'],
            expected: { mocha: { watch: true } }
          },
          {
            provided: ['-w'],
            expected: { mocha: { watch: true } }
          },
          {
            provided: ['--watch=false'],
            expected: { mocha: { watch: false } }
          }
        ]
      },
      {
        argumentName: 'watch-files',
        scenarios: [
          {
            provided: ['--watch-files', '**testable**.js'],
            expected: {
              mocha: { 'watch-files': ['**testable**.js'] }
            }
          }
        ]
      },
      {
        argumentName: 'watch-ignore',
        scenarios: [
          {
            provided: ['--watch-ignore', '**notTestable**.js'],
            expected: { mocha: { 'watch-ignore': ['**notTestable**.js'] } }
          }
        ]
      },
      {
        argumentName: 'opts',
        scenarios: [
          {
            provided: ['--opts', 'mochapack.opts'],
            expected: { mocha: { opts: 'mochapack.opts' } }
          }
        ]
      }
    ]

    mochaArgs.forEach(arg => {
      context(`when parsing arguments for ${arg.argumentName}`, () => {
        it(`uses the default set by Mocha`, () => {
          const defaultMochaOption = mochaOptions[arg.argumentName]
          const parsedMochaArgs = parseArgv([]).mocha
          if (_isUndefined(parsedMochaArgs)) {
            expect(defaultMochaOption.default).to.be.undefined // eslint-disable-line
          } else {
            expect(parsedMochaArgs[arg.argumentName]).to.eql(
              mochaFullDefaults[arg.argumentName]
            )
          }
        })

        arg.scenarios.forEach(scenario => {
          it(`properly interprets '${scenario.provided.join(' ')}'`, () => {
            expect(parseArgv(scenario.provided)).to.eql(
              _merge(
                {},
                {
                  mocha: {
                    ...mochaDefaults,
                    extension:
                      scenario.expected.mocha.extension ||
                      mochaDefaultExtension,
                    'watch-ignore':
                      scenario.expected.mocha['watch-ignore'] ||
                      mochaDefaultWatchIgnore
                  },
                  webpack: {},
                  mochapack: mochapackDefaults
                },
                scenario.expected
              )
            )
          })
        })
      })
    })
  })

  context('when handling arguments for Webpack', () => {
    const webpackArgs = [
      {
        argumentName: 'include',
        scenarios: [
          {
            provided: ['--include', 'test.js'],
            expected: { webpack: { include: ['test.js'] } }
          },
          {
            provided: ['--include', 'test-a.js', '--include', 'test-b.js'],
            expected: { webpack: { include: ['test-a.js', 'test-b.js'] } }
          }
        ]
      },
      {
        argumentName: 'mode',
        scenarios: [
          {
            provided: ['--mode', 'development'],
            expected: { webpack: { mode: 'development' } }
          }
        ]
      },
      {
        argumentName: 'webpack-config',
        scenarios: [
          {
            provided: ['--webpack-config', 'path/to/config.js'],
            expected: { webpack: { 'webpack-config': 'path/to/config.js' } }
          }
        ]
      },
      {
        argumentName: 'webpack-env',
        scenarios: [
          {
            provided: ['--webpack-env', 'custom-env'],
            expected: { webpack: { 'webpack-env': 'custom-env' } }
          }
        ]
      }
    ]

    webpackArgs.forEach(arg => {
      context(`when parsing arguments for ${arg.argumentName}`, () => {
        it(`uses the default set by Mochapack`, () => {
          const defaultWebpackOption = webpackOptions[arg.argumentName]
          expect(defaultWebpackOption.default).to.be.undefined // eslint-disable-line
        })

        arg.scenarios.forEach(scenario => {
          it(`properly interprets '${scenario.provided.join(' ')}'`, () => {
            expect(parseArgv(scenario.provided)).to.eql(
              _merge(
                {},
                {
                  mocha: mochaFullDefaults,
                  webpack: {},
                  mochapack: mochapackDefaults
                },
                scenario.expected
              )
            )
          })
        })
      })
    })
  })

  context('when handling arguments for Mochapack', () => {
    const mochapackArgs = [
      {
        argumentName: 'quiet',
        scenarios: [
          {
            provided: ['--quiet'],
            expected: { mochapack: { quiet: true } }
          },
          {
            provided: ['-q'],
            expected: { mochapack: { quiet: true } }
          }
        ]
      },
      {
        argumentName: 'interactive',
        scenarios: [
          {
            provided: ['--interactive'],
            expected: { mochapack: { interactive: true } }
          }
        ]
      },
      {
        argumentName: 'clear-terminal',
        scenarios: [
          {
            provided: ['--clear-terminal'],
            expected: { mochapack: { 'clear-terminal': true } }
          }
        ]
      },
      {
        argumentName: 'glob',
        scenarios: [
          {
            provided: ['--glob', '**globpattern**.js'],
            expected: { mochapack: { glob: '**globpattern**.js' } }
          }
        ]
      }
    ]

    mochapackArgs.forEach(arg => {
      context(`when parsing arguments for ${arg.argumentName}`, () => {
        it(`uses the default set by Mochapack`, () => {
          const defaultMochapackOption = mochapackOptions[arg.argumentName]
          const parsedMochapackArgs = parseArgv([]).mochapack
          if (_isUndefined(parsedMochapackArgs)) {
            expect(defaultMochapackOption.default).to.be.undefined // eslint-disable-line
          } else {
            expect(parsedMochapackArgs[arg.argumentName]).to.eql(
              mochapackDefaults[arg.argumentName]
            )
          }
        })

        arg.scenarios.forEach(scenario => {
          it(`properly interprets '${scenario.provided.join(' ')}'`, () => {
            expect(parseArgv(scenario.provided)).to.eql(
              _merge(
                {},
                {
                  mocha: mochaFullDefaults,
                  webpack: {},
                  mochapack: mochapackDefaults
                },
                scenario.expected
              )
            )
          })
        })
      })
    })
  })
})
