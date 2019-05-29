const path = require('path')
const {
  stopSpinner,
  chalk,
  to,
  projectObj,
} = require('../shared-utils/index.js')
const LipoShell = require('./core-shell/lipo-shell')
const {
  loadConf
} = require('./utils/load-gckit')

async function cliLipo(param, options) {
  let scope = {
    rootPath: process.cwd(),
    gckitRoot: path.resolve(__dirname, '../../')
  }
  let conf = await loadConf()
  let {
    target,
    scheme,
    workspaceFile,
    projectFile,
    channel = false,
    archs = 'arm64',
    isDebug = false,
    iphonesimulatorFile,
    iphoneosFile
  } = options
  if (iphonesimulatorFile && iphoneosFile) {
    //如果指定了iphonesimulatorFile与iphoneosFile则就不需要进行编译了
    Object.assign(scope, conf, {
      iphonesimulatorFile,
      iphoneosFile
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
    Object.assign(scope, {
      target,
      scheme,
      channel,
      archs,
      isDebug,
      iphonesimulatorFile,
      iphoneosFile
    })
  }
  let lipoShell = new LipoShell(scope)
  await lipoShell.execShell()
}
module.exports = (...args) => {
  return cliLipo(...args).catch(err => {
    stopSpinner()
    console.log(`🌎  ${chalk.red('您正在执行静态库合并的操作，需要当前工程包含静态库工程')}`);
    console.log('🤭  不好意思，出错啦尝试一下方案解决:');
    console.log(`👉  首先查看帮助命令:${chalk.blue('gckit p -h')}`);
    console.log(`👉  查看当前工程的相关信息:${chalk.blue(`xcodebuild --list`)}`);
    console.log(`🐝  尝试指定:${chalk.blue(`gckit p -t "**" -s "**"`)}`);
    process.exit(1)
  })
}
