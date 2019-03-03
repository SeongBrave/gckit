const _ = require('lodash');
const path = require('path')
const fs = require('fs-extra')
const {
  error,
  warn,
  insertStr
} = require('../../shared-utils/index')
const chalk = require('chalk')
const {
  loadFile
} = require('../utils/load-gckit')
const {
  areYouOk
} = require('../utils/prompts')
/**
 *更具参数创建文件
 *
 *  @option {String} rootPath 生成文件路径
 * @option {String} templatePath - 模板路径
 * [@option {Boolean} force=false]
 * 等还有模板中需要的参数
 * @param {*} options
 */
async function CreateFile(options) {
  const {
    outPutFile,
    templatePath
  } = options
  let alltemp = await loadFile(templatePath)
  let file = path.resolve(outPutFile)
  const exists = await fs.pathExists(file)
  if (exists) {
    if (options[options.generatorType].isProject && options.registervc) {
      //这块主要是兼容router
      const rc = await fs.readFile(file, 'utf8');
      if (rc.indexOf(options.viewcontrollerName) === -1) {
        const ret = insertStr(rc, 'navigator.register', `${options.registervc}\t`)
        return await fs.writeFile(file, ret, 'utf-8')
      } else {
        return
      }
    } else {
      if (options.force) {
        if (options[options.generatorType].isProject) {
          let isOk = await areYouOk(options.fileName)
          if (!isOk) {
            return warn(`${options.fileName} 文件已存在`)
          }
        }
      } else {
        return warn(`${options.fileName} 文件已存在`)
      }
    }
  }
  //确保.gckit目录存在
  await fs.ensureDir(path.dirname(file))
  await fs.writeFile(file, _.template(alltemp)(options), 'utf-8')
}
module.exports = (...args) => {
  return CreateFile(...args).catch(err => {
    error(err)
    process.exit(1)
  })
}
