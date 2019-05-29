[
  'env',
  'logger',
  'spinner',
  'string',
  'to',
  'shell',
  'linkmap'
].forEach(m => {
  Object.assign(exports, require(`./lib/${m}`))
})

exports.chalk = require('chalk')
