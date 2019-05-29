const path = require('path')
const chalk = require('chalk');
const fs = require('fs-extra')
const moment = require('moment')
const BaseSehll = require('./base-shell.js')
const {
  execXcodeBuild,
} = require('../../shared-utils/index.js')

const XcodeProject = require('../helpers/xcode-project')
module.exports = class LipoShell extends BaseSehll {
  constructor(scope) {
    super(scope)
    this.iphonesimulatorFile = ''
    this.iphoneosFile = ''
  }

  /**
   *临时文件存放，完成后会删除
   * @readonly
   */
  get lipoTmpPath() {
    return path.resolve(this.outPath, 'tmp')
  }

  get execShellStr() {
    return `xcodebuild ${this.action} ${this.wpName}  -scheme "${this.scheme}" -configuration "${this.configuration}" `
  }

  get linkmapXcconfig() {
    let lp = path.resolve(this.scope.gckitRoot, 'gckit-templates/xcodebuild/linkmap.xcconfig')
    return ` -xcconfig "${lp}" `
  }

  get execLibIPhoneStr() {
    this.iphoneosFile = path.resolve(this.lipoTmpPath, "iphoneos", `lib${this.scheme}.a`);
    return `-sdk  "iphoneos" clean build CONFIGURATION_BUILD_DIR=${path.resolve(this.lipoTmpPath,"iphoneos")}`
  }

  get execLibSimulatorStr() {
    this.iphonesimulatorFile = path.resolve(this.lipoTmpPath, "iphonesimulator", `lib${this.scheme}.a`);
    return `-sdk  "iphonesimulator" clean build CONFIGURATION_BUILD_DIR=${path.resolve(this.lipoTmpPath,"iphonesimulator")}`
  }

  async execLibIPhone() {
    await execXcodeBuild(` ${this.execShellStr} ${this.execLibIPhoneStr} `)
  }

  async execLibSimulator() {
    await execXcodeBuild(` ${this.execShellStr} ${this.execLibSimulatorStr} `)
  }
  /**
   *是否指定文件路径
   * @readonly
   */
  get isOkFile() {
    return this.scope.iphoneosFile && this.scope.iphonesimulatorFile
  }

  get iphoneosFilePath() {
    if (this.isOkFile) {
      return this.scope.iphoneosFile
    } else {
      return this.iphoneosFile
    }
  }

  get iphonesimulatorFilePath() {
    if (this.isOkFile) {
      return this.scope.iphonesimulatorFile
    } else {
      return this.iphonesimulatorFile
    }
  }

  get outPath() {
    let output = this.scope.lipoObj.output;
    let project = this.scope.projectName || path.parse(this.scope.rootPath).name;
    if (output.indexOf('${') > -1) {
      //这块用了eval函数替换${project}
      output = eval('`' + output + '`')
    }
    return path.resolve(this.scope.rootPath, output)
  }

  async execLipoCreate() {
    let project = this.scope.projectName || path.parse(this.scope.rootPath).name;
    let libOutPath = path.resolve(this.outPath, 'lib')
    await fs.ensureDir(libOutPath)
    let lpt = `lipo -create "${this.iphoneosFilePath}" "${this.iphonesimulatorFilePath}"  -output "${libOutPath}/lib${project}.a"`
    await execXcodeBuild(lpt)
  }

  /**
   * 拷贝头文件
   */
  async execCopyHeaderFile() {
    await fs.copy(path.resolve(path.parse(this.iphoneosFilePath).dir, 'usr/local/'), this.outPath)
  }

  async removeTmpFile() {
    await fs.remove(this.lipoTmpPath)
  }

  logSuccess() {
    super.logSuccess()
    console.log(`🚀  编译项目为:${chalk.green(this.target)}`);
    console.log(`👉  输出目录为: ${chalk.green(this.outPath)}`);
    console.log(`📅  编译时间为:${chalk.green(moment().format('YYYY年MM月DD日hh:mm:ss'))}`);
    console.log('👍  Tell your friends!');
  }

  async execShell() {
    if (this.scope.iphoneosFile && this.scope.iphonesimulatorFile) {
      await this.execLipoCreate()
    } else {
      super.execShell()
      let xcodeProject = new XcodeProject(this.projectFile)
      await xcodeProject.parseObj()
      this.t_scheme = xcodeProject.getLibraryTarget().comment
      this.t_target = xcodeProject.getLibraryTarget().comment
      await super.execShell()
      await this.execLibIPhone()
      await this.execLibSimulator()
      await this.execLipoCreate()
      await this.execCopyHeaderFile()
      await this.removeTmpFile()
      this.logSuccess()
    }
  }
}
