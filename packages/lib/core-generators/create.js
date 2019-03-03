const _ = require('lodash')
const path = require('path')
const fs = require('fs-extra')
const moment = require('moment');
const createFile = require('../helpers/create-file.js')
const {
  listExtObj
} = require('../utils/datalist')
module.exports = class Create {
  constructor(scope) {
    this.lang = scope.lang
    this.stepObjcH = 1
    this.generatorType = scope.generatorType
    this.scope = scope
  }
  get langObj() {
    return this.scope.langList.find((il) => il.lang === this.lang)
  }
  get isStepObjcH() {
    //isStepObjcH  Objective 默认先生存.h 然后生成.m 0表示非objc 1表示objc生成.h 2表示objc生成.m文件
    if (this.isFileExtList) {
      return this.stepObjcH
    } else {
      return 0
    }
  }
  resetDataList() {

  }
  doObjcNext() {
    if (this.isStepObjcH === 1) {
      this.stepObjcH++
    }
  }
  get isAllCreated() {
    if (this.isFileExtList) {
      return this.isStepObjcH >= this.langObj.ext.length
    } else {
      return true
    }
  }
  get isCrossPlatform() {
    return this.langObj.crossPlatform;
  }
  get mainPath() {
    var mainPath = this.scope.mainPath
    if (this.scope.isPod) {
      mainPath = 'Classes'
    }
    if (this.isCrossPlatform) {
      mainPath = _.lowerFirst(mainPath)
    } else {
      mainPath = _.upperFirst(mainPath)
    }
    return mainPath
  }
  get isFileExtList() {
    return Array.isArray(this.langObj.ext)
  }
  get fileExt() {
    const ext = this.langObj.ext
    if (this.isFileExtList) {
      return ext[this.isStepObjcH - 1]
    } else {
      return ext
    }
  }
  get listExt() {
    return listExtObj[this.scope.list]
  }
  formatCellSuffix(suffix) {
    let position = suffix.lastIndexOf('_')
    if (position != -1) {
      position = position + '_'.length
    } else if (suffix.lastIndexOf('/') != -1) {
      position = suffix.lastIndexOf('/') + '/'.length
    } else {
      position = 0
    }
    let str = [suffix.slice(0, position), this.listExt, _.upperFirst(suffix.slice(position))].join('')
    return str
  }
  addGTypeNames() {
    for (const generatorType of this.scope.cacheGtypes) {
      let gTypeName = `${this.scope.prefix}${_.upperFirst(this.scope.name)}${this.scope[generatorType].suffix}`
      if (this.scope[generatorType].isProject) {
        gTypeName = `${this.scope.prefix}${_.upperFirst(this.scope.project)}${this.scope[generatorType].suffix}`
      }
      //针对cell做一下特殊处理
      if (generatorType === 'cell') {
        gTypeName = this.formatCellSuffix(gTypeName)
      }
      Object.assign(this.scope, {
        [`${generatorType}Name`]: gTypeName
      })
    }
  }
  get className() {
    return this.scope[`${this.scope.generatorType}Name`]
  }
  get fileName() {
    if (this.langObj.crossPlatform) {
      return `${_.snakeCase(this.className)}.${this.fileExt}`
    } else {
      return `${this.className}.${this.fileExt}`
    }
  }
  get scopeProject() {
    var scopeProject = this.scope.project
    if (this.isCrossPlatform) {
      scopeProject = _.lowerFirst(scopeProject)
    } else {
      scopeProject = _.upperFirst(scopeProject)
    }
    return scopeProject
  }
  get relativePath() {
    var relativePath = this.scope.relativePath
    if (this.isCrossPlatform) {
      relativePath = _.lowerFirst(relativePath)
    } else {
      relativePath = _.upperFirst(relativePath)
    }
    return relativePath
  }
  get gTypePath() {
    var gtypepath = this.scope[this.scope.generatorType].path
    if (this.scope.generatorType === 'cell') {
      gtypepath = this.formatCellSuffix(this.scope[this.scope.generatorType].path)
    }
    if (this.isCrossPlatform) {
      gtypepath = _.lowerFirst(gtypepath)
    } else {
      gtypepath = _.upperFirst(gtypepath)
    }
    return gtypepath
  }
  get filePath() {
    if (this.mainPath && _.trim(this.mainPath).length > 0) {
      return path.join(this.scopeProject, this.mainPath, this.gTypePath, this.relativePath)
    } else {
      return path.join(this.scopeProject, this.gTypePath, this.relativePath)
    }
  }
  get outPutFile() {
    return path.join(`${this.filePath}`, this.fileName)
  }
  get templatePath() {
    if (this.isFileExtList) {
      return path.join(this.lang, this.scope.generatorType, `${this.scope.preset}.${this.fileExt}.template`)
    } else {
      return path.join(this.lang, this.scope.generatorType, `${this.scope.preset}.template`)
    }
  }
  async getJson() {
    let fp = path.resolve(this.scope.rootPath, this.scope.tempJPath, `${this.scope.name}.json`)
    let exists = await fs.existsSync(fp)
    if (exists) {
      const obj = await fs.readJson(fp, {
        throws: false
      })
      return obj
    }
  }
  async create() {
    await this._createFile()
  }
  async _createFile() {
    this.addGTypeNames()
    await createFile(Object.assign({}, this.scope, {
      outPutFile: this.outPutFile,
      templatePath: this.templatePath,
      fileName: this.fileName,
      className: this.className
    }))
    if (!this.isAllCreated) {
      this.doObjcNext()
      this.resetDataList()
      this.create()
    }
  }
  async Generator() {
    let json = await this.getJson()
    Object.assign(this.scope, {
      json,
      createtime: moment().format('YYYY/MM/DD'),
      listExt: this.listExt
    })
    this.scope.json = json
    for (const generatorType of this.scope.gTypes) {
      let fpath = path.resolve(this.scope.gckitRoot, 'packages/lib/core-generators', `create-${generatorType}.js`)
      const exists = await fs.pathExists(fpath)
      if (exists) {
        let generatorDef = require(fpath);
        let generator = new generatorDef(Object.assign({}, this.scope, {
          generatorType
        }));
        await generator.create()
      } else {
        let generator = new Create(Object.assign({}, this.scope, {
          generatorType
        }));
        await generator._createFile()
      }
    }
  }
}
