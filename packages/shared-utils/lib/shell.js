const shell = require('shelljs')

//xcodebuild脚本封装，增加了错误处理
exports.execXcodeBuild = async (execStr = 'xcodebuild -help') => {
  return new Promise((resolve, reject) => {
    shell.exec(execStr, {
      timeout: 30000000
    }, function (code, stdout, stderr) {
      if (code != 0) return reject(new Error(stderr));
      let ret = stdout.replace(/[\r\n]/g, "")
      let err = ret.match(/xcodebuild: error:/)
      if (err) {
        return reject(err)
      } else {
        return resolve(ret)
      }
    });
  })
}
