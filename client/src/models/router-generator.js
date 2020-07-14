/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 18:15:36 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-05-21 09:21:37
 */

/**
 * 用于自动化生成路有的类，路由规则与views下的文件名称一致
 */
export default class RouterGenerator {
  constructor() {

  }

  /**
   * 创建项目路由
   * @param { VueRouter } Router VueRouter
   */
  static create(Router) {
    const { listObject, list } = RouterGenerator.getRouterItems()
    const routes = RouterGenerator.setRouterItemTier(listObject, list)
    return new Router({
      routes
    })
  }

  // 获取所以的路由项
  static getRouterItems() {
    const rfiles = require.context('../views', true, /index.vue$/)
    const listObject = {}
    const list = rfiles.keys().map(path => {
      // 获取路由所在组件
      const comp = rfiles(path).default
      // path 模版 ./login/index.vue
      // 去除路径中最后的/index.vue及首个.
      const indexVueLen = 10
      path = path.substring(1, path.length - indexVueLen)
      const routerItem = RouterGenerator.createRouterItem(comp, path)
      listObject[path] = routerItem
      return routerItem
    })
    return { listObject, list }
  }

  /**
  * 创建路由项
  * @param { Component } comp 路由所在组件
  * @param { String } path 路由地址
  */
  static createRouterItem(comp, path) {
    const pathLv = path.split('/').length
    const routePath = path === '' ? '/' : path
    return {
      pathLv,
      path: routePath,
      route: {
        path: routePath,
        redirect: comp.redirect,
        component: () => import(`@/views${path}`),
        children: []
      }
    }
  }

  /**
   * 设置路由项的层级关系
   * @param { Object } listObject 
   * - 以path作为key，routerItem作为value的对象
   * @param { Array<routerItem> } list 
   */
  static setRouterItemTier(listObject, list) {
    // 对路由层级进行排序
    list.sort((a, b) => a.pathLv - b.pathLv)
    for (let i = list.length - 1; i > 0; i--) {
      const data = list[i]
      // 获取父及路由路径
      const parentPath = data.path.replace(/([/][^/]+)$/, '')
      listObject[parentPath].route.children.push(data.route)
    }
    const routes = listObject[''].route
    return [routes]
  }

}
