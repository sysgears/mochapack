import { join, resolve, sep, normalize } from 'path'
import { expect } from 'chai'
import { merge as _merge } from 'lodash'
import { SinonSandbox, createSandbox } from 'sinon'
import { ProgressPlugin, LoaderOptionsPlugin } from 'webpack'
import createWebpackConfig from '.'
import { CreateWebpackConfigOptions, MochapackWebpackConfigs } from './types'
import * as mochapackPlugins from '../../../webpack/plugin/buildProgressPlugin'
import { MOCHAPACK_NAME } from '../../../util/constants'

describe('createWebpackConfig', () => {
  const fixturesDir = resolve(
    __dirname,
    '../../../..',
    'test/fixture/createWebpackConfig'
  )
  const cwd = process.cwd()
  const dummyProgressPlugin: ProgressPlugin = new ProgressPlugin()
  let sandbox: SinonSandbox
  let configOptions: CreateWebpackConfigOptions
  let createdConfig: MochapackWebpackConfigs
  let expectedTempPath: string

  beforeEach(async () => {
    sandbox = createSandbox()
    sandbox.stub(Date, 'now').returns(12345)
    sandbox
      .stub(mochapackPlugins, 'buildProgressPlugin')
      .returns(dummyProgressPlugin)
    configOptions = {
      cwd,
      entries: ['test/fixture/createWebpackConfig/**.js'],
      entryLoaderPath: 'path/to/entry/loader',
      entryPath: 'path/to/entry',
      includeLoaderPath: 'path/to/include/loader',
      includes: ['hello.js', 'world.js'],
      interactive: false,
      webpackConfig: {}
    }
    expectedTempPath = join(cwd, '.tmp', MOCHAPACK_NAME, '12345')
    createdConfig = await createWebpackConfig(configOptions)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('builds the entry config using the provided options', () => {
    expect(createdConfig.entryConfig.files).to.eql([
      resolve(fixturesDir, 'fooBar.js'),
      resolve(fixturesDir, 'helloWorld.js')
    ])
  })

  context('when an output path does not exist', () => {
    it('uses a temporary path as the output path', () => {
      expect(createdConfig.webpackConfig.output.path).to.eql(expectedTempPath)
    })

    it('adds a temporary path to the output path with a separator for the public path', () => {
      expect(createdConfig.webpackConfig.output.publicPath).to.eql(
        expectedTempPath + sep
      )
    })
  })

  context('when an output path exists', () => {
    beforeEach(async () => {
      configOptions = _merge({}, configOptions, {
        webpackConfig: { output: { path: 'existing/path' } }
      })

      createdConfig = await createWebpackConfig(configOptions)
    })

    it('uses the existing output path', () => {
      expect(createdConfig.webpackConfig.output.path).to.eql(
        normalize('existing/path')
      )
    })

    context('when a public path is not provided', () => {
      it('is set to undefined', () => {
        expect(createdConfig.webpackConfig.output.publicPath).to.be.undefined
      })
    })

    context('when a public path is provided', () => {
      beforeEach(async () => {
        configOptions = _merge({}, configOptions, {
          webpackConfig: {
            output: {
              path: 'existing/path',
              publicPath: 'existing/public/path/'
            }
          }
        })

        createdConfig = await createWebpackConfig(configOptions)
      })

      it('uses the existing public path', () => {
        expect(createdConfig.webpackConfig.output.publicPath).to.eql(
          'existing/public/path/'
        )
      })
    })
  })

  context('when no plugins are present in the provided webpack config', () => {
    context('when interactive is false', () => {
      it('sets the plugins to an empty array', () => {
        expect(createdConfig.webpackConfig.plugins).to.eql([])
      })
    })

    context('when interactive is true', () => {
      it('includes the buildProgressPlugin in the plugins array', async () => {
        configOptions = _merge({}, configOptions, {
          interactive: true
        })

        createdConfig = await createWebpackConfig(configOptions)
        expect(createdConfig.webpackConfig.plugins).to.include(
          dummyProgressPlugin
        )
      })
    })
  })

  context('when plugins are present in the provided webpack config', () => {
    const dummyProvidedPlugin = new LoaderOptionsPlugin({})

    beforeEach(async () => {
      configOptions = _merge({}, configOptions, {
        webpackConfig: {
          plugins: [dummyProvidedPlugin]
        }
      })

      createdConfig = await createWebpackConfig(configOptions)
    })

    context('when interactive is false', () => {
      it('sets the plugins to provided plugins', () => {
        expect(createdConfig.webpackConfig.plugins).to.eql([
          dummyProvidedPlugin
        ])
      })
    })

    context('when interactive is true', () => {
      it('appends the buildProgressPlugin to the provided plugins', async () => {
        configOptions = _merge({}, configOptions, {
          interactive: true
        })

        createdConfig = await createWebpackConfig(configOptions)
        expect(createdConfig.webpackConfig.plugins).to.eql([
          dummyProvidedPlugin,
          dummyProgressPlugin
        ])
      })
    })
  })

  context('when no other loader rules are present', () => {
    it('sets loader rules to applicable rules for Mochapack', () => {
      // Using stringify to avoid mismatch of EntryConfig object
      expect(JSON.stringify(createdConfig.webpackConfig.module.rules)).to.eql(
        JSON.stringify([
          {
            test: 'path/to/entry',
            use: [
              {
                loader: 'path/to/include/loader',
                options: {
                  include: ['hello.js', 'world.js']
                }
              },
              {
                loader: 'path/to/entry/loader',
                options: {
                  entryConfig: {
                    files: [
                      resolve(fixturesDir, 'fooBar.js'),
                      resolve(fixturesDir, 'helloWorld.js')
                    ]
                  }
                }
              }
            ]
          }
        ])
      )
    })
  })

  context('when other loader rules are present', () => {
    it('adds loader rules applicable to Mochapack to the beginning of the array', async () => {
      configOptions = _merge({}, configOptions, {
        webpackConfig: {
          module: {
            rules: [
              {
                test: 'some/test/rule',
                use: [{ loader: 'my/special/loader' }]
              }
            ]
          }
        }
      })
      createdConfig = await createWebpackConfig(configOptions)

      // Using stringify to avoid mismatch of EntryConfig object
      expect(JSON.stringify(createdConfig.webpackConfig.module.rules)).to.eql(
        JSON.stringify([
          {
            test: 'path/to/entry',
            use: [
              {
                loader: 'path/to/include/loader',
                options: {
                  include: ['hello.js', 'world.js']
                }
              },
              {
                loader: 'path/to/entry/loader',
                options: {
                  entryConfig: {
                    files: [
                      resolve(fixturesDir, 'fooBar.js'),
                      resolve(fixturesDir, 'helloWorld.js')
                    ]
                  }
                }
              }
            ]
          },
          {
            test: 'some/test/rule',
            use: [{ loader: 'my/special/loader' }]
          }
        ])
      )
    })
  })
})
