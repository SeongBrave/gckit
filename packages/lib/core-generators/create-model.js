const _ = require('lodash')
const langData = require('../utils/lang-data.js')
const {
  loadFile
} = require('../utils/load-gckit')
const Create = require('./create.js')
module.exports = class CreateModel extends Create {
  constructor(scope, ispublic = false, hasCreateModels) {
    super(scope)
    this.json = scope.json
    this.ispublic = scope.ispublic || ispublic
    this.attrList = []
    this.attrKeyList = []
    this.initList = []
    this.dictList = []
    this.subModelList = []
    this.hasCreateModels = hasCreateModels || []
  }
  get AccessControl() {
    if (this.lang === 'swift' && this.ispublic) {
      return 'public'
    } else {
      return ''
    }
  }
  get keywords() {
    return langData.keywords
  }
  resetDataList() {
    super.resetDataList()
    this.attrList = []
    this.attrKeyList = []
    this.initList = []
    this.dictList = []
    this.subModelList = []
  }
  analysistAttr(attr) {
    let type = typeof attr
    if (type === 'object') {
      if (attr === null) {
        return 'string'
      } else if (Array.isArray(attr)) {
        return 'array'
      } else {
        return 'obj'
      }
    } else if (type === 'number') {
      if (`${attr}`.match(/^\d+\.\d?/)) {
        return 'double'
      } else {
        return 'int'
      }
    } else {
      //boolean string
      return type
    }
  }
  getSubClassName(key) {
    return `${_.upperFirst(this.scope.prefix)}${_.upperFirst(key)}${this.scope.model.suffix}`
  }
  async createSubModel(key, json, subClassName) {
    if (this.hasCreateModels.includes(key)) {
      return
    }
    this.subModelList.push(subClassName)
    let type = this.analysistAttr(json)
    if (type === 'array' && json.length > 0) {
      this.hasCreateModels.push(key)
      for (const sj of json) {
        let so = Object.assign({}, this.scope, {
          name: key,
          json: sj
        })
        let sc = new CreateModel(so, this.ispublic, this.hasCreateModels);
        await sc.create()
      }
    } else if (type === 'obj') {
      this.hasCreateModels.push(key)
      let obj = Object.assign({}, this.scope, {
        name: key,
        json
      })
      let sc = new CreateModel(obj, this.ispublic, this.hasCreateModels);
      await sc.create()
    }
  }
  getAttrType(json) {
    let type = this.analysistAttr(json)
    return this.langObj.types[type]
  }
  //是否是基本数据类型
  isObjType(json) {
    return ['array', 'obj'].includes(this.analysistAttr(json))
  }
  async analysist(obj) {
    for (let [attr, json] of Object.entries(obj)) {
      let objType = this.analysistAttr(json)
      let subClassName = this.getSubClassName(attr)
      let isBaseDataType = false
      if (this.isObjType(json)) {
        if (objType === 'obj' && this.scope.isDeep) {
          await this.createSubModel(attr, json, subClassName)
        } else if (objType === 'array' && json.length > 0) {
          let subJson = json[0]
          if (this.isObjType(subJson)) {
            if (this.scope.isDeep) {
              await this.createSubModel(attr, json[0], subClassName)
            }
          } else {
            //表示为基本数据类型 在生成数组的时候判断
            isBaseDataType = true
            subClassName = this.getAttrType(subJson)
          }
        } else {
          break
        }
      }
      let [attr_key_temp, attr_temp, init_temp, dict_temp] = await Promise.all([
        this.loadAttrTemp('attr.key'),
        this.loadAttrTemp('attr'),
        this.loadAttrTemp('init'),
        this.loadAttrTemp('dict'),
      ])
      let attrName = attr
      if (this.keywords.includes(attr)) {
        attrName = `${this.scope.name}${attr}`
      }
      let arrt_key_options = {
        attrKey: `k${this.scope.name}${_.upperFirst(attr)}Key`,
        attr,
        attrName,
        objType,
        attrType: this.getAttrType(json),
        subClassName,
        isBaseDataType,
        accessControl: this.AccessControl
      }
      this.attrKeyList.push(_.template(attr_key_temp)(arrt_key_options))
      this.attrList.push(_.template(attr_temp)(arrt_key_options))
      this.initList.push(_.template(init_temp)(arrt_key_options))
      this.dictList.push(_.template(dict_temp)(arrt_key_options))
    }
  }
  getEntriesObj(val = this.json) {
    if (typeof val === 'object') {
      if (Array.isArray(val)) {
        if (val.length > 0) {
          return this.getEntriesObj(val[0])
        }
      } else {
        return val
      }
    }
  }
  async loadAttrTemp(fileName) {
    let fpath = `${this.lang}/model/${this.scope.preset}.${fileName}.template`
    return loadFile(fpath)
  }
  async create() {
    let obj = this.getEntriesObj()
    if (!obj) {
      throw new Error(`没有对应的json数据`)
    }
    await this.analysist(obj)
    Object.assign(this.scope, {
      attr: this.attrList.join('').replace(/(\n)+/ig, "\n"),
      attrKey: this.attrKeyList.join('').replace(/(\n)+/ig, "\n"),
      init: this.initList.join('').replace(/(\n)+/ig, "\n"),
      dict: this.dictList.join('').replace(/(\n)+/ig, "\n"),
      atClass: this.subModelList.map((e) => `#import "${e}.h"`).join('\n'),
      className: this.className,
    })
    await this._createFile()
  }
}
