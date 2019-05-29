const package = require('../../package.json');
const path = require('path')
const {
  stopSpinner,
  chalk,
  to,
  projectObj,
} = require('../shared-utils/index.js')
const IpaShell = require('./core-shell/ipa-shell')
const {
  loadConf
} = require('./utils/load-gckit')
const {
  promptChannel
} = require('./utils/prompts')
async function cliIpa(param, options) {
  let scope = {
    rootPath: process.cwd(),
    gckitRoot: path.resolve(__dirname, '../../')
  }
  let conf = await loadConf()
  let {
    bundleId,
    scheme,
    target,
    archs = 'arm64',
    channel = false,
    loadBundleId = false,
    workspaceFile,
    projectFile,
    mbobileprovisionFile = '',
    show = false,
    bitcode = false,
  } = options

  if (mbobileprovisionFile) {
    show = true
    Object.assign(scope, conf, {
      mbobileprovisionFile,
      show
    })
  } else {
    if (workspaceFile || projectFile) {
      let projectName = path.parse(workspaceFile || projectFile).name
      //当没有指定projectFile的时候需要根据workspaceFile主动设置下
      if (workspaceFile && !projectFile) {
        projectFile = path.resolve(path.parse(workspaceFile).dir, `${path.parse(workspaceFile).name}.xcodeproj`)
      }
      Object.assign(scope, conf, {
        projectFile,
        workspaceFile,
        projectName
      })
    } else {
      let [, {
        projectFile,
        workspaceFile
      }] = await to(projectObj())
      if (!projectFile) {
        return console.log('👉 未找到对应的iOS相关项目');
      }
      let projectName = path.parse(projectFile).name
      Object.assign(scope, conf, {
        projectFile,
        workspaceFile,
        projectName
      })
    }
    let method = ''
    if (channel) {
      method = await promptChannel()
    }
    Object.assign(scope, {
      target,
      scheme,
      channel,
      archs,
      bundleId,
      show,
      bitcode,
      method,
      loadBundleId
    })
  }
  let ipaShell = new IpaShell(scope)
  await ipaShell.execShell()
}

module.exports = (...args) => {
  return cliIpa(...args).catch(err => {
    stopSpinner()
    console.log(`🌎  ${chalk.red('您正在执行导出IPA文件')}`);
    console.log('🤭  不好意思，出错啦尝试一下方案解决:');
    console.log(`👉  首先查看帮助命令:${chalk.blue('gckit i -h')}`);
    console.log(`👉  查看当前工程的相关信息:${chalk.blue(`xcodebuild --list`)}`);
    console.log(`🐝  尝试指定:${chalk.blue(`gckit i -t "**" -s "**"`)}`);
    process.exit(1)
  })
}
