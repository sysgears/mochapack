const path = require('path')

module.exports = {
  asyncOnly: true,
  require: [path.resolve(__dirname, 'required.js') ],
}