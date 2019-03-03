const os = require('os');
const glob = require("glob")
const path = require('path')
const _ = require('lodash');

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
