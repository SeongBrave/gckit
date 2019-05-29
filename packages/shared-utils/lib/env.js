const os = require('os');
const glob = require("glob")
const path = require('path')
const _ = require('lodash')
const xcode = require('xcode')
const {
  to
} = require('./to')

/**
 *提取系统名称
 *
 * @returns
 */
exports.hostname = () => {
  let chunks = os.hostname().split('.');
  let hostname = "apple";
  if (chunks.length > 0) {
    hostname = chunks.shift();
  } else {
    hostname = os.hostname();
  }
  return hostname;
}

/**
 *判断是否为Pod项目
 *
 * @returns
 */
exports.isPod = async () => {
  return new Promise((resolve) => {
    glob(path.resolve(process.cwd(), '*.podspec'), {}, function (er, files) {
      if (er || files.length === 0) {
        return resolve(false)
      }
      return resolve(true)
    })
  })
}

exports.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 *提取项目名称 默认为GcKit
 *
 * @returns
 */
exports.getProjectName = async () => {
  return new Promise((resolve, reject) => {
    glob(path.resolve(process.cwd(), '*.{podspec,xcworkspace,xcodeproj}'), {}, function (er, files) {
      if (er) {
        return reject(er)
      }
      for (const item of files) {
        let p = path.parse(item).name
        if (p === '_Pods') {
          continue
        } else {
          return resolve(p)
        }
      }
      return resolve(_.upperFirst(path.basename(process.cwd())))
    })
  })
}

exports.filterFileByExt = async (ext, fpath = process.cwd()) => {
  return new Promise((resolve, reject) => {
    glob(path.resolve(fpath, ext), {}, function (er, files) {
      if (er) {
        return reject(er)
      }
      if (files.length > 0) {
        return resolve(files)
      } else {
        return reject('未找到对应的文件')
      }
    })
  })
}

/**
 *提取项目名称 如果找不到就抛出错误
 *
 * @returns
 */
exports.filterProjectName = async (fpath = process.cwd()) => {
  let files = await exports.filterFileByExt('*.xcodeproj', fpath)
  return new Promise(async (resolve, reject) => {
    files = files.filter(i => path.parse(i).name != '_Pods')
    if (files.length > 0) {
      return resolve(files[0])
    } else {
      return reject('未找到合适的项目')
    }
  })
}

/**
 *根据存在的projectFile目录查询对应的workspace项目
 *
 * @returns
 */
exports.isWorkspaceByProjectFile = async (projectFile) => {
  let files = await exports.filterFileByExt('*.xcworkspace', path.parse(projectFile).dir)
  return new Promise(async (resolve, reject) => {
    files = files.filter(i => path.parse(i).name === path.parse(projectFile).name)
    if (files.length > 0) {
      return resolve(files[0])
    } else {
      return reject('未找到合适的项目')
    }
  })
}


exports.projectObj = async (fpath = process.cwd()) => {
  let err, projectFile;
  //TODO: 这块可能会存在问题，不能是万能的，只能处理pod和所在工程项目
  [err, projectFile] = await to(exports.filterProjectName())
  let isIpd = await exports.isPod()
  if (err && !projectFile) {
    if (isIpd) {
      //首先在本目录下找，如果找不到就再判断是否是pod项目，如果是pod项目则再到Example目录寻找
      projectFile = await exports.filterProjectName(path.resolve(fpath, 'Example'))
    }
  }
  let [, workspaceFile] = await to(exports.isWorkspaceByProjectFile(projectFile))
  return {
    projectFile,
    workspaceFile
  }
}

exports.parsePbxproj = async function (projectFile) {
  return new Promise((resolve, reject) => {
    let xProject = xcode.project(`${projectFile}/project.pbxproj`)
    xProject.parse(function (err, obj) {
      if (err) {
        return reject(err)
      }
      return resolve(obj)
    })
  })
}

exports.isLibraryByTarget = async function (projectFile, target) {
  let pojectObj = await exports.parsePbxproj(projectFile)
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
  } = pojectObj
  let targets = re_Project.targets.filter(item => item.coment === target)
  targets.forEach(rt => {
    const {
      buildConfigurationList
    } = objects.PBXNativeTarget[rt.value]

    const {
      buildConfigurations
    } = XCConfigurationList[buildConfigurationList]
    const [{
      value,
      comment
    }] = buildConfigurations
    const {
      buildSettings
    } = XCBuildConfiguration[value]
    //这块是区别判断library与project的主要逻辑
    if (buildSettings && buildSettings['OTHER_LDFLAGS']) {
      return true
    } else {
      continue
    }
  });
  return false

}
