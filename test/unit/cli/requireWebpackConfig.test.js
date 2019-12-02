/* eslint-env node, mocha */

import path from 'path';
import { assert } from 'chai';
import { rejects } from 'assert';
import requireWebpackConfig from '../../../src/cli/requireWebpackConfig';

describe('requireWebpackConfig', () => {
  const getConfigPath = (extension, suffix = 'config-test') =>
    path.join(__dirname, 'fixture', 'webpackConfig', `webpack.${suffix}${extension}`);

  const expectedConfigPath = path.join(__dirname, 'fixture', 'webpackConfig', 'expected.json');
  const expectedConfig = require(expectedConfigPath); // eslint-disable-line global-require, import/no-dynamic-require

  it('requires plain JavaScript Webpack config file', async () => {
    const configPath = getConfigPath('.js');
    assert.deepEqual(await requireWebpackConfig(configPath), expectedConfig);
  });

  (process.platform === 'win32' ? it.skip : it)('requires symlinked config file', async () => {
    const configPath = getConfigPath('.js', 'config-symlink');
    assert.deepEqual(await requireWebpackConfig(configPath), expectedConfig);
  });

  it('requires Babel Webpack config file', async () => {
    const configPath = getConfigPath('.babel.js');
    assert.deepEqual(await requireWebpackConfig(configPath), expectedConfig);
  });

  it('requires CoffeeScript Webpack config file', async () => {
    const configPath = getConfigPath('.coffee');
    assert.deepEqual(await requireWebpackConfig(configPath), expectedConfig);
  });

  it('requires CoffeeScript Webpack config file with config.js', async () => {
    const configPath = getConfigPath('.js', 'config');
    assert.deepEqual(await requireWebpackConfig(configPath), expectedConfig);
  });

  it('supports config that exports a function', async () => {
    const configPath = getConfigPath('.js', 'config-function');
    assert.deepEqual(await requireWebpackConfig(configPath, false, 'test'), expectedConfig);
  });

  it('supports config that exports a Promise', async () => {
    const configPath = getConfigPath('.js', 'config-promise');
    assert.deepEqual(await requireWebpackConfig(configPath, false, 'test'), expectedConfig);
  });

  it('throws error when multi compiler config is given', async () => {
    const configPath = getConfigPath('.js', 'config-multi');
    const error = 'Passing multiple configs as an Array is not supported. Please provide a single config instead.';
    await rejects(() => requireWebpackConfig(configPath, true), { message: error });
  });

  it('throws error when not found when required', async () => {
    const configPath = getConfigPath('.js', 'config-xxx');
    await rejects(
      () => requireWebpackConfig(configPath, true),
      { message: `Webpack config could not be found: ${configPath}` },
    );
  });

  it('return empty config when not found and not required', async () => {
    const configPath = getConfigPath('.xxx', 'config-xxx');
    assert.deepEqual(await requireWebpackConfig(configPath), {});
  });
});
