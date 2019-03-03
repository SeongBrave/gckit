const _ = require('lodash')
const {
  loadFile
} = require('../utils/load-gckit')
const Create = require('./create.js')
module.exports = class createRouter extends Create {
  constructor(scope) {
    super(scope)
  }
  async loadregistervc(fileName) {
    let fpath = `${this.lang}/router/${this.scope.preset}.${fileName}.template`
    return loadFile(fpath)
  }
  async create() {
    this.addGTypeNames()
    let registervctemp = await this.loadregistervc('registervc')
    Object.assign(this.scope, {
      registervc: _.template(registervctemp)(this.scope),
    })
    await this._createFile()
  }
}
