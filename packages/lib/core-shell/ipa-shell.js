const path = require('path')
const chalk = require('chalk');
const fs = require('fs-extra')
const moment = require('moment')
const BaseSehll = require('./base-shell.js')
const {
  execXcodeBuild,
} = require('../../shared-utils/index.js')
const XcodeProject = require('../helpers/xcode-project')
const MobileprovisionParse = require('../helpers/mobileprovision-parse')
module.exports = class IpaShell extends BaseSehll {
  constructor(scope) {
    super(scope)
    this.xcconfigStr = ''
    this.method = ''
    this.exportOptionsPlistStr = ''
    this.sbundleid = ''
    this.codeSignIdentity = ''
  }

  get bundleId() {
    if (this.scope.loadBundleId && this.scope.ipa && this.scope.ipa.bundleId) {
      return this.scope.ipa.bundleId
    } else if (this.scope.bundleId) {
      return this.scope.bundleId
    } else {
      //这块表示没有指定，则获取本工程的bundleid
      return
    }
  }

  get action() {
    return 'archive'
  }

  //表示是否要加载配置项目
  get isLoadBundleId() {
    return this.scope.loadBundleId
  }

  get outPath() {
    return path.resolve(this.scope.rootPath, this.scope.ipa.output)
  }

  //最后需要删除的
  get tmpPath() {
    return path.resolve(this.outPath, 'tmp')
  }

  get archivePath() {
    return path.resolve(this.tmpPath, `archive/${this.scheme}.xcarchive`)
  }

  get exportOptionsPlistPath() {
    return path.resolve(this.tmpPath, `exportOptions/${this.scheme}.plist`)
  }

  get xcconfigPath() {
    return path.resolve(this.tmpPath, `build/${this.scheme}.xcconfig`)
  }
  get xcconfigShellStr() {
    if (this.isLoadBundleId) {
      return `-xcconfig "${this.xcconfigPath}"`
    } else {
      return ''
    }
  }

  get execArchiveShellStr() {
    return `${this.execShellStr} -target="${this.target}" -configuration "Release" ${this.xcconfigShellStr} -archivePath "${this.archivePath}" clean build `
  }

  get exportPathIpa() {
    return path.resolve(this.outPath, `${this.target}${moment().format('MMDD_hh_mm')}`)
  }

  get execExportArchiveShellStr() {
    return `xcodebuild  -exportArchive -archivePath "${this.archivePath}" -exportPath "${this.exportPathIpa}" -exportOptionsPlist "${this.exportOptionsPlistPath}"`
  }

  async execArchiveShell() {
    await fs.ensureDir(path.parse(this.archivePath).dir)
    if (this.isLoadBundleId) {
      await fs.ensureDir(path.parse(this.xcconfigPath).dir)
      await fs.writeFile(this.xcconfigPath, this.xcconfigStr, 'utf-8')
    }
    await execXcodeBuild(this.execArchiveShellStr)
    await fs.ensureDir(path.parse(this.exportOptionsPlistPath).dir)
    await fs.writeFile(this.exportOptionsPlistPath, this.exportOptionsPlistStr, 'utf-8')
    await execXcodeBuild(this.execExportArchiveShellStr)
    await fs.remove(this.tmpPath)
    this.logSuccess()
  }

  logSuccess() {
    super.logSuccess()
    console.log(`🍓  导出项目为:${chalk.green(this.target)}`);
    console.log(`🍒  输出目录为: ${chalk.green(this.exportPathIpa)}`);
    console.log(`🥝  编译BundleId: ${chalk.green(this.sbundleid)}`);
    console.log(`🍅  使用的证书: ${chalk.green(this.codeSignIdentity)}`);
    console.log(`🥑  打包时间: ${chalk.green(moment().format('YYYY年MM月DD日hh:mm:ss'))}`);
    console.log(`🥦  发布方式为: ${chalk.green(this.method)}`);
    console.log('👍  Tell your friends!');
  }

  async execShell() {
    if (this.scope.mbobileprovisionFile) {
      let mbp = new MobileprovisionParse()
      await mbp.parseCerObjByFileName(this.scope.mbobileprovisionFile)
    } else {
      await super.execShell()
      let bundleId = await this.getBundleId()
      Object.assign(this.scope, {
        bundleId
      })
      let mbp = new MobileprovisionParse(this.scope)
      await mbp.parseMobileProvisionObj(bundleId, this.scope.method.channel)
      if (this.scope.show) {
        return mbp.logObj()
      }
      this.exportOptionsPlistStr = await mbp.getExportOptionsPlist()
      this.xcconfigStr = mbp.getXcconfig()
      this.method = await mbp.getMethod()
      this.sbundleid = bundleId
      this.codeSignIdentity = mbp.mbOjb.signObj.codeSignIdentity
      //终于准备好啦，可以真正实现导出ipa文件啦
      await this.execArchiveShell()
    }
  }

  async getBundleId() {
    if (this.bundleId) {
      return this.bundleId
    } else {
      let xcodeProject = new XcodeProject(this.projectFile)
      await xcodeProject.parseObj()
      let buildSettings = xcodeProject.getProjectTargetBuildSettings()
      return buildSettings['PRODUCT_BUNDLE_IDENTIFIER']
    }
  }
}
