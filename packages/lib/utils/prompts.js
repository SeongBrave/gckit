const inquirer = require('inquirer')
const {
  datalist,
  baseq,
  gckitKeys,
  moduleq
} = require('./datalist')
const {
  error,
  chalk
} = require('../../shared-utils/index.js')
const _ = require('lodash')
exports.promptQuestion = async (cGTypes, cLangList) => {
  let baseObj = await inquirer.prompt(baseq)
  let list = datalist.gkeyList.map(x => x.id)
  let {
    lang,
    prefix = ''
  } = await inquirer.prompt([{
    type: 'list',
    name: 'lang',
    default: 'swift',
    message: '选择语言',
    choices: datalist.langList.concat(cLangList).map((i) => i.lang)
  }, {
    type: 'input',
    name: 'prefix',
    default: 'JDJR_',
    when: answers => answers.lang === 'objc',
    message: '类前缀'
  }])
  //默认生成的类型
  let gTypes = await inquirer.prompt([{
    type: 'checkbox',
    name: 'gTypes',
    message: '选择默认生成的类型',
    choices: list.concat(cGTypes.map((i) => i.gType)).map(x => {
      return {
        name: x,
        checked: ['viewcontroller', 'model'].includes(x)
      }
    })
  }])
  let result = {}
  //这块同步循环 询问每个问题
  for (const item of list) {
    let mObj = await inquirer.prompt(moduleq[item])
    result[item] = {
      ...mObj
    }
  }
  return Object.assign(baseObj, gTypes, result, {
    lang,
    prefix
  })
}
exports.customGeneratorType = async (oldTypes) => {
  let arr = []
  while (true) {
    const {
      name
    } = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: '输入类型名称【不能包含关键字】',
      validate: function (val) {
        let done = this.async();
        if (val && val.length > 0 && !gckitKeys.concat(oldTypes.map((i) => i.gType), arr.map((i) => i.gType)).includes(val)) {
          done(null, true);
        }
        done('请输入正确的名称');
      }
    }])
    const {
      path,
      suffix,
      isProject,
      isContinue
    } = await inquirer.prompt([{
      type: 'input',
      name: 'path',
      default: _.upperFirst(name),
      message: `${name}路径`
    }, {
      type: 'input',
      name: 'suffix',
      default: `_${name}`,
      message: `${name}的后缀`
    }, {
      type: 'confirm',
      name: 'isProject',
      default: false,
      message: '是否项目文件?【如果项目文件就会更具project生成否则会更具name生成】'
    }, {
      type: 'confirm',
      name: 'isContinue',
      default: false,
      message: '是否要继续创建类型'
    }])
    arr.push({
      gType: name,
      path,
      suffix,
      isProject,
    })
    if (!isContinue) {
      return arr
    }
  }
}

exports.customLangList = async (oldLangList) => {
  let arr = []
  while (true) {
    const {
      lang
    } = await inquirer.prompt([{
      type: 'input',
      name: 'lang',
      message: '输入语言名称【不能包含关键字】',
      validate: function (val) {
        let done = this.async();
        if (val && val.length > 0 && !gckitKeys.concat(oldLangList.map((i) => i.lang), arr.map((i) => i.gType)).includes(val)) {
          done(null, true);
        }
        done('请输入语言名称');
      }
    }])
    const {
      ext,
      hasPrefix,
      crossPlatform
    } = await inquirer.prompt([{
      type: 'input',
      name: 'ext',
      default: lang,
      message: `${lang}类型的文件后缀`
    }, {
      type: 'confirm',
      name: 'hasPrefix',
      default: false,
      message: '是否包含前缀'
    }, {
      type: 'confirm',
      name: 'crossPlatform',
      default: false,
      message: '是否是跨平台语言(跨平台考虑区别大小写问题文件名为小写下划线的形式，否则大写)'
    }])
    const {
      isContinue,
      ...types
    } = await inquirer.prompt([{
      type: 'input',
      name: 'obj',
      default: 'obj',
      message: `${lang}的object类型为`
    }, {
      type: 'input',
      name: 'array',
      default: 'array',
      message: `${lang}的array类型为`
    }, {
      type: 'input',
      name: 'int',
      default: 'int',
      message: `${lang}的int类型为`
    }, {
      type: 'input',
      name: 'double',
      default: 'double',
      message: `${lang}的double类型为`
    }, {
      type: 'input',
      name: 'string',
      default: 'string',
      message: `${lang}的string类型为`
    }, {
      type: 'input',
      name: 'boolean',
      default: 'boolean',
      message: `${lang}的boolean类型为`
    }, {
      type: 'confirm',
      name: 'isContinue',
      default: false,
      message: '是否要继续创建类型'
    }])
    arr.push({
      lang,
      ext,
      hasPrefix,
      types,
      crossPlatform
    })
    if (!isContinue) {
      return arr
    }
  }
}

exports.inputName = async (cGTypes) => {
  //生成名称
  let {
    name
  } = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: '输入生成名称【不能包含关键字】',
    validate: function (val) {
      let done = this.async();
      if (val && val.length > 0 && !gckitKeys.concat(cGTypes.map((i) => i.gType)).includes(val)) {
        done(null, true);
      }
      done('请输入正确的名称');
    }
  }])
  return name
}

exports.inputList = async (args) => {
  //生成名称
  let {
    list
  } = await inquirer.prompt([{
    type: 'list',
    name: 'list',
    default: 'none',
    message: 'tableview还是collectionview',
    choices: datalist.list
  }])
  return list
}
exports.areYouOk = async (fileName) => {
  //生成名称
  let {
    isOk
  } = await inquirer.prompt([{
    type: 'confirm',
    name: 'isOk',
    default: false,
    message: `确认强制覆盖${chalk.red(fileName)}文件吗?`
  }])
  return isOk
}

exports.inputPreset = async (args) => {
  //生成名称
  let {
    preset
  } = await inquirer.prompt([{
    type: 'list',
    name: 'preset',
    default: 'normal',
    message: '生成文件类型',
    choices: datalist.presetList
  }])
  return preset
}
