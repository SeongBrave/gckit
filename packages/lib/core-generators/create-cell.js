const _ = require('lodash')
const {
  loadFile
} = require('../utils/load-gckit')
const Create = require('./create.js')
module.exports = class createCell extends Create {
  constructor(scope) {
    super(scope)
  }
  get superClassName() {
    if (this.scope.list === 'cv') {
      return 'UICollectionViewCell'
    } else {
      return 'UITableViewCell'
    }
  }
  async create() {
    Object.assign(this.scope, {
      superClassName: this.superClassName
    })
    super.create()
  }
}
