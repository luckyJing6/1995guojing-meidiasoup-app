/*
 * @Author: 郭靖 
 * @Date: 2020-05-28 16:32:52 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-05-28 17:13:25
 */
// 网络请求错误
class HttpException extends Error {
  constructor(msg = '请求错误', code = -1, status = 400, data = '') {
    super()
    this.msg = msg
    this.code = code
    this.status = status
    this.data = data
  }
}

// 参数错误
class ParameterException extends HttpException {
  constructor(msg = '参数错误', code = 10000) {
    super()
    this.msg = msg
    this.code = code
  }
}

// 参数校验失败
class AuthFailed extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.status = 401
    this.data = ''
    this.msg = msg || '参数校验不通过'
    this.code = errorCode || 10001
  }
}

// 成功
class Success extends HttpException {
  constructor(data, msg) {
    super()
    this.status = 200
    this.data = data || ''
    this.msg = msg || '成功'
    this.code = 0
  }
}

module.exports = {
  HttpException,
  ParameterException,
  AuthFailed,
  Success
}