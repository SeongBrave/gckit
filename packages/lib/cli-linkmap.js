const package = require('../../package.json');
const path = require('path')
const {
  stopSpinner,
  chalk,
  to,
  projectObj,
} = require('../shared-utils/index.js')
const LinkMapShell = require('./core-shell/linkmap-shell')
const {
  loadConf
} = require('./utils/load-gckit')

async function cliLikMap(param, options) {

  let scope = {
    rootPath: process.cwd(),
    gckitRoot: path.resolve(__dirname, '../../')
  }
  let conf = await loadConf()
  const {
    scheme,
    target,
    archs = 'arm64',
    isDebug = false,
    format = false,
    staticlib = false,
    output = false,
    filepath
  } = options
  if (filepath) {
    Object.assign(scope, conf, {
      format,
      output,
      staticlib,
      isDebug,
      filepath,
    })
    let linkMapShell = new LinkMapShell(scope)
    await linkMapShell.execShell()
  } else {
    let [, {
      projectFile,
      workspaceFile
    }] = await to(projectObj())
    if (!projectFile) {
      return console.log('👉 未找到对应的iOS相关项目');
    }
    let name = path.parse(projectFile).name
    Object.assign(scope, conf, {
      target,
      scheme,
      projectFile,
      workspaceFile,
      format,
      output,
      staticlib,
      isDebug,
      name,
      archs
    })
    let linkMapShell = new LinkMapShell(scope)
    await linkMapShell.execShell()
  }

}
module.exports = (...args) => {
  return cliLikMap(...args).catch(err => {
    stopSpinner()
    console.log(`🌎  ${chalk.red('您正在执行统计包增量大小')}`);
    console.log('🤭  不好意思，出错啦尝试一下方案解决:');
    console.log(`👉  首先查看帮助命令:${chalk.blue('gckit l -h')}`);
    console.log(`👉  查看当前工程的相关信息:${chalk.blue(`xcodebuild --list`)}`);
    console.log(`🐝  尝试指定:${chalk.blue(`gckit l -t "**" -s "**"`)}`);
    process.exit(1)
  })
}
