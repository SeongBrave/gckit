const {
  stopSpinner,
  error,
  isPod,
  getProjectName
} = require('../shared-utils/index.js')
const inquirer = require('inquirer')
const moment = require('moment');
const package = require('../../package.json');
const path = require('path')
const _ = require('lodash');
const Create = require('./core-generators/create')
// const opn = require('opn');
const {
  datalist
} = require('./utils/datalist')
const {
  inputName,
  inputPreset,
  inputList
} = require('./utils/prompts')
const {
  loadConf
} = require('./utils/load-gckit')

function isKey(val, cGTypes = [], type) {
  if (type === 'gkey') {
    return datalist.gkeyList.reduce((prev, value) => {
      return prev.concat(value.filters)
    }, []).concat(cGTypes.map((i) => i.gType)).includes(val)
  } else {
    return datalist.gkeyList.reduce((prev, value) => {
      return prev.concat(value.filters)
    }, []).concat(datalist.list, cGTypes.map((i) => i.gType)).includes(val)
  }
}
async function Generate(param, options) {
  let scope = {
    rootPath: process.cwd(),
    gckitRoot: path.resolve(__dirname, '../../'),
    modules: {},
    gckitPackageJSON: package,
  }
  let [ipod, project, conf] = await Promise.all([isPod(), getProjectName(), loadConf()])
  let name = ''
  let rgType = ''
  let rpreset = ''
  let rlist = ''
  const {
    force,
    preset,
    list,
    moduleName,
    ispublic
  } = options
  for (const item of param) {
    if (isKey(item, conf.cGTypes)) {
      if (isKey(item, conf.cGTypes, 'gkey')) {
        rgType = item
      } else {
        rlist = item
      }
    } else {
      name = item
    }
  }
  if (!name) {
    name = await inputName(conf.cGTypes)
  }
  let relname = _.last(name.split(/\//));
  let relativePath = name.substring(0, name.indexOf(relname))
  if (preset) {
    rpreset = await inputPreset()
  }
  if (!rlist && list) {
    rlist = await inputList()
  }
  if (moduleName) {
    //配置默认的moduleName
    scope.moduleName = moduleName
    if (project === 'GcKit') {
      project = moduleName
    }
  }
  Object.assign(scope, conf, {
    isPod: ipod,
    project,
    name: relname,
    relativePath: relativePath || ''
  })
  if (force) {
    Object.assign(scope, {
      force: force
    })
  }
  if (rlist) {
    Object.assign(scope, {
      list: rlist
    })
  }
  if (rgType) {
    let hc = conf.cGTypes.find((i) => i.gType === rgType)
    if (hc) {
      Object.assign(scope, {
        gTypes: [hc.gType]
      })
    } else {
      Object.assign(scope, {
        gTypes: [datalist.getGType(rgType)]
      })
    }
  }
  if (rpreset) {
    Object.assign(scope, {
      preset: rpreset
    })
  }
  Object.assign(scope, {
    ispublic,
    cacheGtypes: datalist.gkeyList.map(i => i.id).concat(conf.cGTypes.map(i => i.gType))
  })
  // logWithSpinner(`✨`, `代码生成中...`)
  let create = new Create(scope)
  await create.Generator()
  stopSpinner()
  // console.log(chalk.red(`• • • • • • • • • • • • • • • • • • • • • • • • • • • • • •`));
  // console.log(chalk.red(`•  ${chalk.cyan('Loading Sails with "verbose" logging enabled...')}        •`));
  // console.log(chalk.red(`•  ${chalk.cyan('(For even more details, try "silly".)')}                  •`));
  // console.log(chalk.red(`•                                                         •`));
  // console.log(chalk.red(`•  ${chalk.cyan('(http://sailsjs.com/config/log".)')}                          •`));
  // console.log(chalk.red(`• • • • • • • • • • • • • • • • • • • • • • • • • • • • • •`));
  // opn('http://sindresorhus.com', {
  //   app: ['google chrome', '--incognito']
  // }).then(() => {
  //   // image viewer closed
  // });




  // let packageName = '哈哈'
  // log(`${chalk.green('✔')}  Successfully installed plugin: ${chalk.cyan(packageName)}`)
  // info(`${chalk.green('✔')}  Successfully installed plugin: ${chalk.cyan(packageName)}`)
  // warn(
  //   `Skipped git commit due to missing username and email in git config.\n` +
  //   `You will need to perform the initial commit yourself.\n`
  // )
  // log(`哈哈哈哈哈对方`, `哈市的法定fa
  // sfdasdfhaosdhfi
  // 阿斯蒂芬哈师大分开了`)
  // info(`info`, `哈市的法定fa
  // sfdasdfhaosdhfi
  // 阿斯蒂芬哈师大分开了`)

  // console.log('projectName', projectName);
  // console.log('options', chalk.bgBlackBright.white.bold(` ${'哈哈哈👺'} `));


  // logWithSpinner(`✨`, `Creating project in ${chalk.yellow('context')}.`)

  // setTimeout(() => {
  //   stopSpinner()
  // }, 5000);

}
module.exports = (...args) => {
  return Generate(...args).catch(err => {
    stopSpinner()
    error(err)
    process.exit(1)
  })
}
