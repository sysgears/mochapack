const path = require('path')

module.exports = {
  asyncOnly: true,
  allowUncaught: false,
  ignore: ['**doNotTest.js'],
  require: [path.resolve(__dirname, 'required.js') ]
}