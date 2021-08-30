# Using mochapack in IDEs

## Debug in IDEA (WebStorm, IntelliJ, ...)

1. Make sure the `NodeJS` repository plugin is installed and enabled. The plugin is not bundled with every IDEA product, but it can be installed from the JetBrains plugin repository.
1. Create a Testrunner config
  ![IDEA run configuration](../media/idea-run-configuration.png)
   - replace `Mocha package` path with path of mochapack (should be a (dev-) dependency of your project)
   - set some additional configuration options (mochapack.opts in this case)
   - specify the tests to run
1. make sure that your webpack config contains the following (important for setting breakpoints in src):

   ``` javascript
   {
     ...

     output: {
         devtoolModuleFilenameTemplate        : '[absolute-resource-path]',
         devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
       },

     ...
   }
   ```
1. also you have to use a *non-eval* devtool in your webpack config, e.g.

   ``` javascript
   {
     ...

     devtool: '#inline-cheap-module-source-map',

     ...
   }
   ```
1. start your run configuration in debug mode
1. happy testing
  ![IDEA mocha test report](../media/idea-mocha-test-report.png)

**Note:** Debugging in watch mode does not work with IDEA. Therefore you have rerun your debugger whenever you make changes.
It's recommended to specify only a single test file to reduce start-up time.

## Debug in Visual Studio Code

1. make sure that you use a *inline* devtool in your webpack config, e.g.

   ``` javascript
   {
     ...

     devtool: '#inline-cheap-module-source-map',

     ...
   }
   ```
1. make sure that your webpack config contains the following (important for setting breakpoints in src):

   ``` javascript
   {
     ...

     output: {
         devtoolModuleFilenameTemplate        : '[absolute-resource-path]',
         devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
       },

     ...
   }
   ```

1. create a launch.json in your .vscode folder like the following:
  ```json
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach",
      "port": 9229
    }
  ]
  ```
1. start the debugger with *F5*
1. happy testing
  ![VS Code Debugger](../media/vscode-debug.png)
