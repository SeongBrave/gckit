const _ = require('lodash')
const {
  loadFile
} = require('../utils/load-gckit')
const Create = require('./create.js')
module.exports = class createViewcontroller extends Create {
  constructor(scope) {
    super(scope)
  }
  get superClassName() {
    /*
    生成模块类型
    normal: 1. 系统生成
    common: 2. 简单的自定义方法
    inherit: 3. 继承父类、导入依赖名
    all: 4. 全量生成
    */
    const {
      preset,
      list
    } = this.scope
    if (preset === 'all') {
      if (list !== 'none') {
        return 'Empty_TVc'
      } else {
        return 'Base_Vc'
      }
    } else if (preset === 'inherit') {
      return 'Base_Vc'
    } else {
      return 'UIViewController'
    }
  }
  get attrListName() {
    return `${this.scope.name}_list`
  }
  get attrListViewName() {
    return `${this.scope.name}_${_.toLower(this.listExt)}v`
  }
  get listViewClass() {
    const {
      list
    } = this.scope
    if (list === 'tv') {
      return 'UITableView'
    } else {
      return 'UICollectionView'
    }
  }
  async create() {
    Object.assign(this.scope, {
      superClassName: this.superClassName,
      attrListName: this.attrListName,
      attrListViewName: this.attrListViewName,
      listViewClass: this.listViewClass,
    })
    super.create()
  }
}
