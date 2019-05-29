const path = require('path')
const {
  to,
  execXcodeBuild,
  showFigletTitle,
} = require('../../shared-utils/index.js')
module.exports = class BaseSehll {
  constructor(scope) {
    this.scope = scope
    //执行完xodebuild -list之后
    this.schemes = []
    this.targets = []
    //用于缓存自动获取的
    this.t_scheme = ''
    //用于缓存自动获取的
    this.t_target = ''
  }

  get target() {
    //用户指定 > 使用project获取 > xodebuild -list获取的
    if (this.scope.target) {
      return this.scope.target
    } else if (this.t_target) {
      return this.t_target
    } else if (this.targets.length > 0) {
      return this.targets[0]
    }
  }

  get scheme() {
    //用户指定 > 使用project获取 > xodebuild -list获取的
    if (this.scope.scheme) {
      return this.scope.scheme
    } else if (this.t_scheme) {
      return this.t_scheme
    } else if (this.schemes.length > 0) {
      return this.schemes[0]
    }
  }

  get configuration() {
    return this.scope.isDebug ? 'Debug' : 'Release'
  }

  get projectFile() {
    return this.scope.projectFile
  }

  get projectName() {
    return path.parse(this.projectFile).name
  }

  get isWorkspace() {
    return this.scope.workspaceFile
  }

  get wpName() {
    if (this.isWorkspace) {
      return `-workspace "${this.scope.workspaceFile}"`
    } else {
      return `-project "${this.projectFile}"`
    }
  }

  get action() {
    return 'build'
  }

  async execXcodeBuildList() {
    let [err, rel] = await to(execXcodeBuild(`xcodebuild  -project "${this.projectFile}" -list`))
    if (rel) {
      this.schemes = rel.match(/Schemes:\s*([\w,\W,-,\s]*)$/)[1].split(' ').filter(el => el && el.length > 0)

      this.targets = rel.match(/Targets:\s*([\w,\W,-,\s]*)Build Configurations:/)[1].split(' ').filter(el => el && el.length > 0)
    } else {
      console.error(err || '未找到相关xcode信息')
    }
  }

  get execShellStr() {
    return `xcodebuild ${this.action} ${this.wpName}  -scheme "${this.scheme}" `
  }

  async execPodShell() {
    if (this.isWorkspace) {
      let wp = path.parse(this.scope.workspaceFile).dir
      let eps = `cd ${wp};pod update --verbose --no-repo-update `
      await execXcodeBuild(eps)
    }
    await this.execXcodeBuildList()
  }

  logSuccess() {
    showFigletTitle()
  }

  async execShell() {
    await this.execXcodeBuildList()
  }

}
