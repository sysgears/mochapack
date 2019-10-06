# Installation

The recommended approach to setup mochapack is to install it locally in your project's directory.

```bash
# install mocha, webpack & mochapack as devDependencies
$ npm install --save-dev mocha webpack mochapack
```
This will install `mocha`, `webpack` and `mochapack` packages in your project directory into `node_modules` and also store them as `devDependencies` in your package.json.

Congratulations, you are ready to run mochapack for the first time in your project!

```bash
# display version of mochapack
$ node ./node_modules/mochapack/bin/mochapack --version

# display available commands & options of mochapack
$ node ./node_modules/mochapack/bin/mochapack --help
```

### Using npm scripts

Typing `node ./node_modules/mochapack/bin/mochapack ....` is just annoying and you might find it useful to configure your run commands as npm scripts inside your `package.json`.


**package.json**
```json
...
"scripts": {
    "test": "mochapack --webpack-config webpack.config-test.js \"src/**/*.test.js\"",
  },
...
```

This allows you to run your test command simply by just typing `npm run test` (or if you prefer yarn `yarn run test`).

In addition, the defined command tells mochapack to use the provided webpack config file `webpack.config-test.js` and to execute all tests matching the pattern `"src/**/*.test.js"`.

**Note:** You may noticed the quotes around the glob pattern. That's unfortunately necessary as most terminals will resolve globs automatically.

For more installation details please have a look at the subchapter of the installation section.
