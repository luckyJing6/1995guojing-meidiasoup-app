/*
 * @Author: 郭靖 
 * @Date: 2020-05-28 17:12:42 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-05-28 17:15:40
 */
const { Success } = require('../../core/http-exception')

// 成功回调
function SuccessResult(data, msg) {
  throw new Success(data, msg)
}

module.exports = {
  SuccessResult
}