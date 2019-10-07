# Contributing

## Issues
Found an issue? Missing a feature or something else? We look forward to receive your feedback.

For bug reports please make sure that you
* clearly describe your problem
* provide us something that allows us to reproduce the problem (a minimal failing example would be awesome)

## Pull Requests

We love pull requests. Here's a quick guide:

1. Fork the repo.

1. Run the tests. We only take pull requests with passing tests, and it's great to know that you have a clean state.

1. Add a test for your change. Only refactoring and documentation changes require no new tests. If you are adding functionality or fixing a bug, we need a test to avoid regressions in future releases.

1. Make the test pass.

1. Push to your fork and submit a pull request.

### How to run tests

1. Make sure you have all dependencies installed
  ```bash
  $ yarn install
  ```

1. Run the tests with:
  ```bash
  $ yarn run test
  ```

### How to test against your project

Wanna test your changes against your real world project? No Problem!

Let's use `yarn link` to symlink the fork into your project.

1. switch to the root of this project

1. make sure you have all dependencies installed
  ```bash
  $ yarn install
  ```

1. run first step for yarn link
  ```bash
  $ yarn link
  ```

1. switch to your real world project

1. and execute the second step for yarn link
  ```bash
  $ yarn link mochapack
  ```

1. You need to configure loader resolution in your webpack config, like below
  ```js
  var path = require('path');

  module.exports = {
    // ..
    // yarn link mochapack hack
    resolveLoader: {
      root: [
       // __dirname is the root of your project, you may need to adjust the path
       path.join(__dirname, "node_modules")
      ]
    };
    // ..
  };
  ```

1. Then you are almost ready to go. You just have to build this project initially and whenever you make code changes.
  ```bash
  $ yarn run build
  ```



### Syntax rules

Please pay attention on the following syntax rules:

* Basic coding styles are defined within the .editorconfig file.
* ESLint automatically checks the code style after tests or manually via `yarn run lint`.
* Follow the conventions used in the source already.
