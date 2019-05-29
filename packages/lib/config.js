const {
  log,
  warn,
  error,
  showFigletTitle,
} = require('../shared-utils/index.js')
const fs = require('fs-extra')
const path = require('path')
const homedir = require('os').homedir()
const packageJson = require('../../package.json');
const {
  promptQuestion,
  customGeneratorType,
  customLangList,
  promptIpa,
  promptLinkMap,
  promptLipo
} = require('./utils/prompts')
const {
  loadCGTypes,
  loadCLangList
} = require('./utils/load-gckit.js')


async function Config(args) {
  let f = args.force || false;
  let p = args.project || false;
  let cg = args.cgtype || false;
  let cl = args.clang || false;
  let s = args.show || false;
  let isipa = args.ipa || false;
  let islp = args.linkmap || false;
  let islipo = args.lipo || false;
  let root = p ? process.cwd() : homedir
  //这边表示正好在homedir下进行配置,然后再设置p为false
  if (process.cwd() === homedir) {
    p = false
  }
  let gckitDir = path.resolve(root, '.gckit')
  showFigletTitle()
  //确保.gckit目录存在
  await fs.ensureDir(gckitDir)
  let file = path.resolve(gckitDir, '.gckitconfig')
  let exists = await fs.existsSync(file)
  if (s) {
    if (exists) {
      let obj = await fs.readJson(file)
      return log(obj);
    } else {
      return warn('😂 还没有配置过呢');
    }
  }
  let obj = {}
  if (exists) {
    if (!f) {
      return error(`已存在当前配置文件\n`)
    } else {
      obj = await fs.readJson(file)
    }
  }
  if (isipa) {
    let ipaObj = await promptIpa()
    Object.assign(obj, {
      ipa: ipaObj
    })
    await fs.writeFile(file, JSON.stringify(obj, null, 2), 'utf-8')
  } else if (islp) {
    let lpOjb = await promptLinkMap()
    Object.assign(obj, {
      linkmap: lpOjb
    })
    await fs.writeFile(file, JSON.stringify(obj, null, 2), 'utf-8')
  } else if (islipo) {
    let lipoObj = await promptLipo()
    Object.assign(obj, {
      lipo: lipoObj
    })
    await fs.writeFile(file, JSON.stringify(obj, null, 2), 'utf-8')
  } else if (cg) {
    let oc = []
    if (p) {
      //如果是项目配置 则不能再配置已经存在的用户维度自定义的配置
      oc = await loadCGTypes()
    }
    let cGTypes = await customGeneratorType(oc)
    Object.assign(obj, {
      cGTypes
    })
    await fs.writeFile(file, JSON.stringify(obj, null, 2), 'utf-8')
    return log('🎉', '自定义文件类型成功...')
  } else if (cl) {
    let ol = []
    if (p) {
      //如果是项目配置 则不能再配置已经存在的用户维度自定义的配置
      ol = await loadCLangList()
    }
    let cLangList = await customLangList(ol)
    Object.assign(obj, {
      cLangList
    })
    await fs.writeFile(file, JSON.stringify(obj, null, 2), 'utf-8')
    return log('🎉', '自定义语言成功...')
  } else {
    let cGTypes = await loadCGTypes(p)
    let cLangList = await loadCLangList(p)
    let obj = await promptQuestion(cGTypes, cLangList)
    Object.assign(obj, {
      cLangList
    })
    if (cGTypes.length > 0) {
      Object.assign(obj, {
        cGTypes
      })
    }
    await fs.writeFile(file, JSON.stringify(obj, null, 2), 'utf-8')
    log('🎉', '配置成功...')
  }
}
module.exports = (args) => {
  return Config(args).catch(err => {
    error(err)
    process.exit(1)
  })
}
