# mochapack [![Join the chat at https://gitter.im/sysgears/mochapack](https://badges.gitter.im/sysgears/mochapack.svg)](https://gitter.im/sysgears/mochapack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![npm package][npm-badge]][npm] [![Build Status][build-badge]][build]  [![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

This project is a fork of [mocha-webpack](https://github.com/zinserjan/mocha-webpack). We have created this fork since there is no visible activity from original author for a long time.

> mocha test runner with integrated webpack precompiler

mochapack is basically a wrapper around the following command...

```bash
$ webpack test.js output.js && mocha output.js
```

... but in a much more _powerful_ & _optimized_ way.

![CLI](./docs/media/cli-test-success.png)

mochapack ...

- precompiles your test files automatically with webpack before executing tests
- handles source-maps automatically for you
- does not write any files to disk
- understands globs & all other stuff as test entries like mocha

Benefits over plain mocha

- has nearly the same CLI as mocha
- you don't rely on hacky solutions to mock all benefits from webpack, like path resolution
- mochapack provides a much better watch mode than mocha

## Watch mode (`--watch`)

Unlike mocha, mochapack analyzes your dependency graph and run only those test files that were affected by this file change.

You'll get continuous feedback whenever you make changes as all tests that are related in any way to this change will be tested again. Isn't that awesome?

If any build errors happens, they will be shown like below

![CLI](./docs/media/cli-compile-failed.png)

## Which version works with mochapack?

mochapack works with

- webpack in versions `4.x.x` - `5.x.x`
- mocha in versions `5.x.x` - `9.x.x`

## Installation

Install mochapack via npm install

```bash
$ npm install webpack mocha mochapack --save-dev
```

and use it via npm scripts in your `package.json`

Further installation and configuration instructions can be found in the [installation chapter](./docs/installation/setup.md).

## Sample commands

run a single test

```bash
mochapack simple.test.js
```

run all tests by glob

```bash
mochapack "test/**/*.js"
```

**Note:** You may noticed the quotes around the glob pattern. That's unfortunately necessary as most terminals will resolve globs automatically.

run all tests in directory "test" matching the file pattern \*.test.js (add `--recursive` to include subdirectories)

```bash
mochapack --glob "*.test.js" test
```

Watch mode? just add `--watch`

```
mochapack --watch test
```

## Contributing

This project uses [nari] package manager to have reproducible builds without resorting to lockfiles, it uses `lockTime` field in `package.json` instead.

To install `nari` execute:
`npm i -g nari`

And then `nari` to install the project.

To run project scripts use `nari script_name`, for example `nari test` to run unit tests.

## License

This source code is licensed under the [MIT] license.<br/>
Copyright &copy; 2016-2017 Jan-André Zinser<br/>
Copyright &copy; 2018 [SysGears (Cyprus) Limited].

[nari]: https://github.com/narijs/nari
[build-badge]: https://github.com/sysgears/mochapack/actions/workflows/build-and-test.yml/badge.svg
[build]: https://github.com/sysgears/mochapack/actions/workflows/build-and-test.yml
[npm-badge]: https://img.shields.io/npm/v/mochapack.svg?style=flat-square
[npm]: https://www.npmjs.org/package/mochapack
[codecov-badge]: https://codecov.io/gh/sysgears/mochapack/branch/master/graph/badge.svg
[codecov]: https://codecov.io/gh/sysgears/mochapack
[sysgears (cyprus) limited]: https://sysgears.com
[mit]: LICENSE.md
