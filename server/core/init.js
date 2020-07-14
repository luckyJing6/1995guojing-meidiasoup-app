/*
 * @Author: 郭靖 
 * @Date: 2020-05-28 16:36:19 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-05-29 10:02:55
 */
const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
  constructor() {
  }

  /**
   * 
   * @param {Object<Koa>} app koa实例
   */
  static init(app) {
    InitManager.app = app
    // 批量加载路由
    InitManager.initRouters()
  }

  static initRouters(path = '') {
    const routerPath = path || `${process.cwd()}/app/api`
    requireDirectory(module, routerPath, {
      visit: function (router) {
        if (router instanceof Router) {
          InitManager.app.use(router.routes())
        }
      }
    })
  }



}

module.exports = {
  InitManager
}