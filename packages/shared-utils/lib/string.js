/**
 * 字符串插入一个字符串
 * @param {*} source 字符串
 * @param {*} sStr 插入字符串的位置
 * @param {*} rstr
 * @returns
 */
exports.insertStr = function (source, sStr, rStr) {
  const start = source.indexOf(sStr)
  return source.slice(0, start) + rStr + source.slice(start)
}
