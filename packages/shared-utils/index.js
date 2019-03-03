[
  'env',
  'logger',
  'spinner',
  'string'
].forEach(m => {
  Object.assign(exports, require(`./lib/${m}`))
})

exports.chalk = require('chalk')
