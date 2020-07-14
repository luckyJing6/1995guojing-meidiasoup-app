const config = require('../config')
const { HttpException } = require('../core/http-exception')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const isDev = config.environment === 'dev'
    const isHttpException = error instanceof HttpException
    // 开发环境下未知错误打印日志
    if (isDev && !isHttpException) {
      throw error
    }
    // 判断是否为HttpException
    if (isHttpException) {
      let msg = error.msg
      if (msg instanceof Array) {
        // msg = msg.join(';')
      }
      ctx.body = {
        msg,
        code: error.code,
        data: error.data,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.status
    } else {
      ctx.body = {
        msg: "未知错误！",
        code: 9999,
        data: '',
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}