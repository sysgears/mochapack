import chai, { expect } from 'chai'
import { SinonSandbox, SinonSpy, createSandbox } from 'sinon'
import sinonChai from 'sinon-chai'
import { merge as _merge, pick as _pick } from 'lodash'
import Mocha from 'mocha'
import { installedMochaMajor } from '../../../../test/installedMochaVersion'
import { MochapackMochaOptions } from '../../../cli/argsParser/optionsFromParsedArgs/types'
import initMocha from '.'

chai.use(sinonChai)

describe('initMocha', async () => {
  const mochaMajorVersion = await installedMochaMajor
  let sandbox: SinonSandbox
  let initOptions: MochapackMochaOptions
  let defaultOptions: any
  let cwd: string
  let reporterSpy: SinonSpy
  let uiSpy: SinonSpy
  let defaultExtensions = ['js']
  const defaultFiles = ['./files']
  const defaultWatchIgnore = ['node_modules', '.git']
  const defaultCliInitOptions = {
    extension: defaultExtensions,
    files: defaultFiles,
    watchIgnore: defaultWatchIgnore
  }

  beforeEach(() => {
    sandbox = createSandbox()
    initOptions = {
      cli: defaultCliInitOptions,
      constructor: {
        ui: 'bdd'
      }
    }

    if (mochaMajorVersion >= 7) {
      defaultExtensions = ['js', 'cjs', 'mjs']
    }

    defaultOptions = {
      diff: true,
      extension: defaultExtensions,
      grep: undefined,
      opts: './test/mocha.opts',
      package: './package.json',
      reporter: 'spec',
      reporterOptions: undefined,
      slow: 75,
      timeout: 2000,
      ui: 'bdd'
    }

    if (mochaMajorVersion >= 7) {
      defaultOptions = _merge({}, defaultOptions, {
        global: [],
        reporterOption: undefined,
        'watch-ignore': defaultWatchIgnore
      })
    }

    if (mochaMajorVersion >= 8) {
      delete defaultOptions.opts;
    }

    cwd = process.cwd()
    // @ts-ignore
    sandbox.stub(Mocha.prototype, 'isGrowlCapable').returns(true)
    reporterSpy = sandbox.spy(Mocha.prototype, 'reporter')
    uiSpy = sandbox.spy(Mocha.prototype, 'ui')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('returns an instance of Mocha', () => {
    const mocha = initMocha(initOptions, cwd)
    expect(mocha).to.be.instanceOf(Mocha)
  })

  const configurationScenarios: {
    optionName: string
    providedOptions: Partial<MochapackMochaOptions>
    expectedMochaOptions: any
  }[] = [
    {
      optionName: 'color',
      providedOptions: { constructor: { useColors: true } },
      expectedMochaOptions: { useColors: true }
    },
    {
      optionName: 'allowUncaught',
      providedOptions: { constructor: { allowUncaught: true } },
      expectedMochaOptions: { allowUncaught: true }
    },
    {
      optionName: 'asyncOnly',
      providedOptions: { constructor: { asyncOnly: true } },
      expectedMochaOptions: { asyncOnly: true }
    },
    {
      optionName: 'bail',
      providedOptions: { constructor: { bail: true } },
      expectedMochaOptions: { bail: true }
    },
    {
      optionName: 'delay',
      providedOptions: { constructor: { delay: true } },
      expectedMochaOptions: { delay: true }
    },
    {
      optionName: 'forbidOnly',
      providedOptions: { constructor: { forbidOnly: true } },
      expectedMochaOptions: { forbidOnly: true }
    },
    {
      optionName: 'forbidPending',
      providedOptions: { constructor: { forbidPending: true } },
      expectedMochaOptions: { forbidPending: true }
    },
    {
      optionName: 'fullStackTrace',
      providedOptions: { constructor: { fullStackTrace: true } },
      expectedMochaOptions: { fullStackTrace: true }
    },
    {
      optionName: 'globals',
      providedOptions: { constructor: { globals: ['hey'] } },
      expectedMochaOptions: { globals: ['hey'] }
    },
    {
      optionName: 'grep',
      providedOptions: { constructor: { grep: 'hey' } },
      expectedMochaOptions: { grep: new RegExp('hey') }
    },
    {
      optionName: 'invert',
      providedOptions: {
        cli: { ...defaultCliInitOptions, invert: true },
        constructor: {}
      },
      expectedMochaOptions: { invert: true }
    },
    {
      optionName: 'growl',
      providedOptions: { constructor: { growl: true } },
      expectedMochaOptions: { growl: true }
    },
    {
      optionName: 'ignoreLeaks',
      providedOptions: { constructor: { ignoreLeaks: true } },
      expectedMochaOptions: { ignoreLeaks: true }
    },
    {
      optionName: 'inlineDiffs',
      providedOptions: { constructor: { inlineDiffs: true } },
      expectedMochaOptions: { inlineDiffs: true }
    },
    {
      optionName: 'noHighlighting',
      providedOptions: { constructor: { noHighlighting: true } },
      expectedMochaOptions: { noHighlighting: true }
    },
    {
      optionName: 'reporter',
      providedOptions: { constructor: { reporter: 'min' } },
      expectedMochaOptions: { reporter: 'min' }
    },
    {
      optionName: 'retries',
      providedOptions: { constructor: { retries: 27 } },
      expectedMochaOptions: { retries: 27 }
    },
    {
      optionName: 'slow',
      providedOptions: { constructor: { slow: 7000 } },
      expectedMochaOptions: { slow: 7000 }
    },
    {
      optionName: 'timeout',
      providedOptions: { constructor: { timeout: 7000 } },
      expectedMochaOptions: { timeout: 7000 }
    }
  ]

  if (mochaMajorVersion < 7) {
    configurationScenarios.push({
      optionName: 'reporterOptions',
      providedOptions: {
        constructor: { reporterOptions: { hello: 'world' } }
      },
      expectedMochaOptions: {
        reporterOptions: { hello: 'world' }
      }
    })
  }

  if (mochaMajorVersion >= 7) {
    configurationScenarios.push(
      {
        optionName: 'hideDiff',
        providedOptions: { constructor: { hideDiff: true } },
        expectedMochaOptions: { hideDiff: true }
      },
      {
        optionName: 'reporterOptions',
        providedOptions: {
          constructor: { reporterOptions: { hello: 'world' } }
        },
        expectedMochaOptions: {
          reporterOption: { hello: 'world' },
          reporterOptions: { hello: 'world' }
        }
      }
    )
  }

  configurationScenarios.forEach(scenario => {
    it(`properly applies ${scenario.optionName}`, () => {
      const mocha = initMocha(
        _merge({}, initOptions, scenario.providedOptions),
        cwd
      )
      const expectedOptions = _merge(
        {},
        defaultOptions,
        scenario.expectedMochaOptions
      )
      expect(_pick(mocha.options, Object.keys(expectedOptions))).to.eql(
        expectedOptions
      )
    })
  })

  it('properly adds files', () => {
    const mocha = initMocha(
      _merge({}, initOptions, { cli: { file: ['setup.js'] } }),
      cwd
    )
    expect(mocha.files).to.eql(['setup.js'])
  })

  it("properly applies the 'reporter' option", () => {
    initMocha(
      _merge({}, initOptions, { constructor: { reporter: 'min' } }),
      cwd
    )
    const reporter = Mocha.reporters.Min
    expect(reporterSpy).to.have.been.calledWith(reporter, undefined)
  })

  it("properly applies the 'ui' option", () => {
    initMocha(_merge({}, initOptions, { constructor: { ui: 'tdd' } }), cwd)
    expect(uiSpy).to.have.been.calledWith('tdd')
  })
})
