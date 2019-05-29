const path = require('path')
const BaseSehll = require('./base-shell.js')
const chalk = require('chalk');
const fs = require('fs-extra')
const padStart = require('string.prototype.padstart')
const moment = require('moment')
const {
  to,
  execXcodeBuild,
  showFigletTitle
} = require('../../shared-utils/index.js')

const LinkMap = require('../../shared-utils/lib/linkmap')
module.exports = class LinkMapShell extends BaseSehll {
  constructor(scope) {
    super(scope)
  }

  get derivedDataPath() {
    return this.tmpPath
  }

  get execShellStr() {
    return `xcodebuild ${this.action} ${this.wpName}  -scheme "${this.scheme}" -configuration "${this.configuration}" `
  }

  get linkmapXcconfig() {
    let lp = path.resolve(this.scope.gckitRoot, 'gckit-templates/xcodebuild/linkmap.xcconfig')
    return ` -xcconfig "${lp}" `
  }

  async execShell() {
    if (this.scope.filepath) {
      this.analysisFile(this.scope.filepath)
      return
    }
    await super.execShell()
    await to(execXcodeBuild(`${this.execShellStr} -derivedDataPath "${this.derivedDataPath}" ${this.linkmapXcconfig}`))
    let filePath = `${this.derivedDataPath}/Build/Intermediates.noindex/${this.scope.name}.build/${this.configuration}-iphoneos/${this.target}.build/${this.target}-LinkMap-normal-${this.scope.archs}.txt`
    await this.analysisFile(filePath)
    await fs.remove(this.tmpPath)
  }

  get outPath() {
    return path.resolve(this.scope.rootPath, this.scope.linkmap.output)
  }

  //最后需要删除的
  get tmpPath() {
    return path.resolve(this.outPath, 'tmp')
  }

  async analysisFile(filePath) {
    let efp = await fs.pathExists(filePath)
    if (!efp) {
      console.log(`🐝 确保${chalk.blue(' Write Link Map File')} 设置为${chalk.red(' YES')}`);
      console.log(`🐝 您可以尝试添加-d参数执行命令:${chalk.red(`gckit l -d`)}`);
      return
    }
    const {
      format,
      staticlib,
      output,
    } = this.scope
    let that = this
    let linkmap = new LinkMap(filePath)
    linkmap.start(function () {
      let ret = staticlib ? linkmap.statLibs(format) : linkmap.statFiles(format)
      let maxLength = 0;
      for (const obj of ret) {
        if (obj.name.length > maxLength) {
          maxLength = obj.name.length
        }
      }
      let str = ''
      let outStr = ''
      for (const obj of ret) {
        str = str + chalk.blue(`${padStart(obj.name, maxLength)}`) + chalk.bold.green(`${padStart(obj.size, 20)}`) + '\n'
        outStr = outStr + `${padStart(obj.name, maxLength)}` + `${padStart(obj.size, 20)}` + '\n'
      }
      if (output) {
        fs.writeFile(path.resolve(that.outPath, `${path.basename(filePath, 'txt')}json`), outStr, 'utf-8')
        showFigletTitle()
        console.log(`🍓  统计Target为:${chalk.green(that.target)}`);
        console.log(`🥑  统计时间: ${chalk.green(moment().format('YYYY年MM月DD日hh:mm:ss'))}`);
      } else {
        that.logSuccess()
        console.log('\n');
        console.log(str);
      }
    })
  }

  logSuccess() {
    super.logSuccess()
    console.log(`🍓  统计Target为:${chalk.green(this.target)}`);
    console.log(`🍒  输出目录为: ${chalk.green(this.outPath)}`);
    console.log(`🥑  统计时间: ${chalk.green(moment().format('YYYY年MM月DD日hh:mm:ss'))}`);
  }

}
