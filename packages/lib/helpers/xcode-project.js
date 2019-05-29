const {
  parsePbxproj
} = require('../../shared-utils/lib/env')
module.exports = class XcodeProject {
  constructor(projectFile) {
    this.projectFile = projectFile
    this.pojectObj = {}
    this.rootObjectId = ''
    this.rootObject = {}
    this.XCConfigurationList = {}
    this.objects = {}
    this.XCBuildConfiguration = {}
    this.targets = []
  }

  async parseObj() {
    this.pojectObj = await parsePbxproj(this.projectFile)
    const {
      project: {
        objects: {
          PBXProject,
          XCConfigurationList,
          XCBuildConfiguration
        },
        objects,
        rootObject
      }
    } = this.pojectObj
    this.rootObjectId = rootObject
    this.XCConfigurationList = XCConfigurationList
    this.XCBuildConfiguration = XCBuildConfiguration
    this.objects = objects
    this.rootObject = PBXProject[rootObject]
    this.targets = this.rootObject.targets
  }

  getBuildConfigurationListByTarget(target) {
    return this.objects.PBXNativeTarget[target.value].buildConfigurationList
  }

  getBuildConfigurationsByTarget(target) {
    return this.XCConfigurationList[
      this.getBuildConfigurationListByTarget(target)
    ].buildConfigurations
  }

  getBuildSettingsByTarget(target) {
    return this.XCBuildConfiguration[
      this.getBuildConfigurationsByTarget(target).value
    ]
  }

  getDebugBuildSettings(target) {
    let debugObj = this.getBuildConfigurationsByTarget(target)[0]
    return this.XCBuildConfiguration[debugObj.value].buildSettings
  }

  getReleaseBuildSettings(target) {
    let debugObj = this.getBuildConfigurationsByTarget(target)[1]
    return this.XCBuildConfiguration[debugObj.value].buildSettings
  }

  isLibraryByTarget(target) {
    let debugBs = this.getDebugBuildSettings(target)
    //BuildSettings 包含OTHER_LDFLAGS 即表示为library
    /** 
     * 观察project.pbxproj文件lib与project的区别如下:项目特有的但是lib没有的字段为:
     * "INFOPLIST_FILE": "**",
     * "ASSETCATALOG_COMPILER_APPICON_NAME": "AppIcon",
     * 并且需要过滤掉test项目，观察发现TEST_HOST为特有字段
     * */
    return (!debugBs['ASSETCATALOG_COMPILER_APPICON_NAME'] && !debugBs['TEST_HOST'])
  }

  //获取一个lib的target
  getLibraryTarget() {
    let libTargets = this.targets.filter(item => this.isLibraryByTarget(item))
    if (libTargets && libTargets.length > 0) {
      return libTargets[0]
    } else {
      return null
    }
  }

  getProjectTarget() {
    let proTargets = this.targets.filter(item => !this.isLibraryByTarget(item))
    if (proTargets && proTargets.length > 0) {
      return proTargets[0]
    } else {
      return null
    }
  }

  getProjectTargetBuildSettings() {
    //默认返回ReleaseBuildSettings
    return this.getReleaseBuildSettings(this.getProjectTarget())
  }
}
