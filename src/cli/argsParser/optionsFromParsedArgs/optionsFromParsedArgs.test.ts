/* eslint-env node, mocha */
import { resolve } from 'path'
import { expect } from 'chai'
import { merge as _merge } from 'lodash'
import { MochaOptions } from 'mocha'
import { ParsedArgs } from '../parseArgv/types'
import optionsFromParsedArgs from '.'
import {
  MochapackOptions,
  MochapackWebpackOptions,
  MochapackSpecificOptions
} from './types'
import { ParsedMochaArgs } from '../parseArgv/mocha/types'
import { ParsedWebpackArgs } from '../parseArgv/webpack/types'
import { ParsedMochapackArgs } from '../parseArgv/mochapack/types'

describe('optionsFromParsedArgs', () => {
  const defaultArgs: ParsedArgs = {
    mocha: {
      diff: true,
      reporter: 'spec',
      slow: '75',
      timeout: '2000',
      ui: 'bdd',
      extension: ['js', 'cjs', 'mjs'],
      'watch-ignore': ['node_modules', '.git']
    },
    webpack: {
      'webpack-config': 'webpack.config.js'
    },
    mochapack: {
      interactive: true,
      'clear-terminal': false
    }
  }

  const defaultOptions: MochapackOptions = {
    mocha: {
      cli: {
        extension: ['js', 'cjs', 'mjs'],
        watchIgnore: ['node_modules', '.git']
      },
      constructor: {
        reporter: 'spec',
        slow: 75,
        timeout: 2000,
        ui: 'bdd',
        fullStackTrace: undefined,
        globals: undefined,
        hideDiff: false,
        ignoreLeaks: true,
        useColors: false,
        grep: undefined,
        reporterOptions: undefined
      }
    },
    webpack: {
      config: 'webpack.config.js'
    },
    mochapack: {
      interactive: true,
      clearTerminal: false
    }
  }

  context('when converting Mocha args to options', () => {
    context('when the argument is for a constructor option', () => {
      const mochaConstructorArgs: {
        argName: string
        optionName: string
        providedArgs: Partial<ParsedMochaArgs>
        expectedOptions: MochaOptions
      }[] = [
        {
          argName: 'diff',
          optionName: 'diff',
          providedArgs: { diff: true },
          expectedOptions: { hideDiff: false }
        },
        {
          argName: 'diff',
          optionName: 'diff',
          providedArgs: { diff: false },
          expectedOptions: { hideDiff: true }
        },
        {
          argName: 'include',
          optionName: 'allowUncaught',
          providedArgs: { 'allow-uncaught': true },
          expectedOptions: { allowUncaught: true }
        },
        {
          argName: 'async-only',
          optionName: 'asyncOnly',
          providedArgs: { 'async-only': true },
          expectedOptions: { asyncOnly: true }
        },
        {
          argName: 'bail',
          optionName: 'bail',
          providedArgs: { bail: true },
          expectedOptions: { bail: true }
        },
        {
          argName: 'delay',
          optionName: 'delay',
          providedArgs: { delay: true },
          expectedOptions: { delay: true }
        },
        {
          argName: 'forbid-only',
          optionName: 'forbidOnly',
          providedArgs: { 'forbid-only': true },
          expectedOptions: { forbidOnly: true }
        },
        {
          argName: 'forbid-pending',
          optionName: 'forbidPending',
          providedArgs: { 'forbid-pending': true },
          expectedOptions: { forbidPending: true }
        },
        {
          argName: 'global',
          optionName: 'globals',
          providedArgs: { global: ['helloWorld'] },
          expectedOptions: { globals: ['helloWorld'] }
        },
        {
          argName: 'grep',
          optionName: 'grep',
          providedArgs: { grep: 'helloWorld.js' },
          expectedOptions: { grep: new RegExp('helloWorld.js') }
        },
        {
          argName: 'growl',
          optionName: 'growl',
          providedArgs: { growl: true },
          expectedOptions: { growl: true }
        },
        {
          argName: 'inline-diffs',
          optionName: 'inlineDiffs',
          providedArgs: { 'inline-diffs': false },
          expectedOptions: { inlineDiffs: false }
        },
        {
          argName: 'reporter',
          optionName: 'reporter',
          providedArgs: { reporter: 'min' },
          expectedOptions: { reporter: 'min' }
        },
        {
          argName: 'retries',
          optionName: 'retries',
          providedArgs: { retries: 7000 },
          expectedOptions: { retries: 7000 }
        },
        {
          argName: 'slow',
          optionName: 'slow',
          providedArgs: { slow: '7000' },
          expectedOptions: { slow: 7000 }
        },
        {
          argName: 'timeout',
          optionName: 'timeout',
          providedArgs: { timeout: '7000' },
          expectedOptions: { timeout: 7000 }
        },
        {
          argName: 'timeout',
          optionName: 'timeout',
          providedArgs: { timeout: '0' },
          expectedOptions: { timeout: 0, enableTimeouts: false }
        },
        {
          argName: 'ui',
          optionName: 'ui',
          providedArgs: { ui: 'tdd' },
          expectedOptions: { ui: 'tdd' }
        },
        {
          argName: 'reporter-option',
          optionName: 'reporterOptions',
          providedArgs: { 'reporter-option': { hello: 'world' } },
          expectedOptions: { reporterOptions: { hello: 'world' } }
        }
      ]

      mochaConstructorArgs.forEach(arg => {
        it(`places ${arg.argName} under options.mocha.constructor.${arg.optionName}`, () => {
          const providedArgs = _merge({}, defaultArgs, {
            mocha: arg.providedArgs
          })
          const extractedOptions = optionsFromParsedArgs(providedArgs)
          expect(extractedOptions.mocha.constructor).to.eql(
            _merge({}, defaultOptions.mocha.constructor, arg.expectedOptions)
          )
        })
      })
    })

    context('when the argument is for a CLI option', () => {
      const mochaCliArgs = [
        {
          argName: 'extension',
          optionName: 'extension',
          providedArgs: { extension: ['ts'] },
          expectedOptions: { extension: ['ts'] }
        },
        {
          argName: 'no-colors',
          optionName: 'no-colors',
          providedArgs: { 'no-colors': true },
          expectedOptions: { colors: false }
        },
        {
          argName: 'file',
          optionName: 'file',
          providedArgs: { file: ['test.js'] },
          expectedOptions: { file: ['test.js'] }
        },
        {
          argName: 'fgrep',
          optionName: 'fgrep',
          providedArgs: { fgrep: '**test.js' },
          expectedOptions: { fgrep: '**test.js' }
        },
        {
          argname: 'exit',
          optionname: 'exit',
          providedargs: { exit: true },
          expectedoptions: { exit: true }
        },
        {
          argName: 'check-leaks',
          optionName: 'checkLeaks',
          providedArgs: { 'check-leaks': true },
          expectedOptions: { checkLeaks: true }
        },
        {
          argName: 'package',
          optionName: 'package',
          providedArgs: { package: 'pkg.json' },
          expectedOptions: { package: 'pkg.json' }
        },
        {
          argName: 'recursive',
          optionName: 'recursive',
          providedArgs: { recursive: true },
          expectedOptions: { recursive: true }
        },
        {
          argName: 'reporter-option',
          optionName: 'reporter-option',
          providedArgs: { 'reporter-option': { hello: 'world' } },
          expectedOptions: { reporterOption: { hello: 'world' } }
        },
        {
          argName: 'color',
          optionName: 'color',
          providedArgs: { color: true },
          expectedOptions: { color: true }
        },
        {
          argName: 'full-trace',
          optionName: 'fullTrace',
          providedArgs: { 'full-trace': true },
          expectedOptions: { fullTrace: true }
        },
        {
          argName: 'ignore',
          optionName: 'ignore',
          providedArgs: { ignore: ['secret.js'] },
          expectedOptions: { ignore: ['secret.js'] }
        },
        {
          argName: 'invert',
          optionName: 'invert',
          providedArgs: { invert: true },
          expectedOptions: { invert: true }
        },
        {
          argName: 'require',
          optionName: 'require',
          providedArgs: { require: ['setup.js'] },
          expectedOptions: { require: ['setup.js'] }
        },
        {
          argName: 'sort',
          optionName: 'sort',
          providedArgs: { sort: true },
          expectedOptions: { sort: true }
        },
        {
          argName: 'watch',
          optionName: 'watch',
          providedArgs: { watch: true },
          expectedOptions: { watch: true }
        },
        {
          argName: 'watch-files',
          optionName: 'watch-files',
          providedArgs: { 'watch-files': ['testThis.js'] },
          expectedOptions: { watchFiles: ['testThis.js'] }
        },
        {
          argName: 'watch-ignore',
          optionName: 'watch-ignore',
          providedArgs: { 'watch-ignore': ['doNotTestThis.js'] },
          expectedOptions: { watchIgnore: ['doNotTestThis.js'] }
        }
      ]

      it('places the option under options.mocha.cli', () => {
        mochaCliArgs.forEach(arg => {
          it(`places ${arg.argName} under options.mocha.constructor.${arg.optionName}`, () => {
            const providedArgs = _merge({}, defaultArgs, {
              mocha: arg.providedArgs
            })
            const extractedOptions = optionsFromParsedArgs(providedArgs)
            expect(extractedOptions.mocha.cli).to.eql(
              _merge({}, defaultOptions.mocha.cli, arg.expectedOptions)
            )
          })
        })
      })
    })

    context('when a config file provides options', () => {
      context('when the config options and CLI args do not overlap', () => {
        it('properly merges config options with CLI args', () => {
          const providedArgs = _merge({}, defaultArgs, {
            mocha: {
              config: 'test/fixture/mochaConfigNoOverlap.js',
              allowUncaught: true,
              ignore: ['**doNotTest.js']
            }
          })
          const extractedOptions = optionsFromParsedArgs(providedArgs)
          expect(extractedOptions.mocha).to.eql(
            _merge({}, defaultOptions.mocha, {
              cli: {
                config: 'test/fixture/mochaConfigNoOverlap.js',
                ignore: ['**doNotTest.js'],
                require: [
                  resolve(__dirname, '../../../..', 'test/fixture/required.js')
                ]
              },
              constructor: {
                allowUncaught: true,
                asyncOnly: true
              }
            })
          )
        })
      })

      context('when the config options and CLI args overlap', () => {
        it('prefers the CLI args over config options', () => {
          const providedArgs = _merge({}, defaultArgs, {
            mocha: {
              config: 'test/fixture/mochaConfigWithOverlap.js',
              allowUncaught: true,
              ignore: ['**dontTest.js']
            }
          })
          const extractedOptions = optionsFromParsedArgs(providedArgs)
          expect(extractedOptions.mocha).to.eql(
            _merge({}, defaultOptions.mocha, {
              cli: {
                config: 'test/fixture/mochaConfigWithOverlap.js',
                ignore: ['**dontTest.js'],
                require: [
                  resolve(__dirname, '../../../..', 'test/fixture/required.js')
                ]
              },
              constructor: {
                allowUncaught: true,
                asyncOnly: true
              }
            })
          )
        })
      })
    })
  })

  context('when converting Webpack args to options', () => {
    const webpackArgs: {
      argName: string
      optionName: string
      providedArgs: Partial<ParsedWebpackArgs>
      expectedOptions: Partial<MochapackWebpackOptions>
    }[] = [
      {
        argName: 'include',
        optionName: 'include',
        providedArgs: { include: ['hello.js'] },
        expectedOptions: { include: ['hello.js'] }
      },
      {
        argName: 'mode',
        optionName: 'mode',
        providedArgs: { mode: 'development' },
        expectedOptions: { mode: 'development' }
      },
      {
        argName: 'webpack-config',
        optionName: 'webpackConfig',
        providedArgs: { 'webpack-config': 'path/to/config.js' },
        expectedOptions: { config: 'path/to/config.js' }
      },
      {
        argName: 'webpack-env',
        optionName: 'env',
        providedArgs: { 'webpack-env': 'customEnv' },
        expectedOptions: { env: 'customEnv' }
      }
    ]

    webpackArgs.forEach(arg => {
      it(`places ${arg.argName} under options.webpack.${arg.optionName}`, () => {
        const providedArgs = _merge({}, defaultArgs, {
          webpack: arg.providedArgs
        })
        const extractedOptions = optionsFromParsedArgs(providedArgs)
        expect(extractedOptions.webpack).to.eql(
          _merge({}, defaultOptions.webpack, arg.expectedOptions)
        )
      })
    })
  })

  context('when converting Mochapack args to options', () => {
    const mochapackArgs: {
      argName: string
      optionName: string
      providedArgs: Partial<ParsedMochapackArgs>
      expectedOptions: Partial<MochapackSpecificOptions>
    }[] = [
      {
        argName: 'quiet',
        optionName: 'quiet',
        providedArgs: { quiet: true },
        expectedOptions: { quiet: true }
      },
      {
        argName: 'interactive',
        optionName: 'interactive',
        providedArgs: { interactive: false },
        expectedOptions: { interactive: false }
      },
      {
        argName: 'clear-terminal',
        optionName: 'clearTerminal',
        providedArgs: { 'clear-terminal': true },
        expectedOptions: { clearTerminal: true }
      },
      {
        argName: 'glob',
        optionName: 'glob',
        providedArgs: { glob: '**findThis**.js' },
        expectedOptions: { glob: '**findThis**.js' }
      }
    ]

    mochapackArgs.forEach(arg => {
      it(`places ${arg.argName} under options.mochapack.${arg.optionName}`, () => {
        const providedArgs = _merge({}, defaultArgs, {
          mochapack: arg.providedArgs
        })
        const extractedOptions = optionsFromParsedArgs(providedArgs)
        expect(extractedOptions.mochapack).to.eql(
          _merge({}, defaultOptions.mochapack, arg.expectedOptions)
        )
      })
    })
  })
})
