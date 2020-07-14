/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 15:56:45 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-05-20 16:01:21
 */
module.exports = {
  // 输出html名称, erp.html
  indexPath: 'index.html',
  // 静态资源文件夹名称
  assetsDir: 'static',
  // cdn 配置
  cdnConfig: {
    // cdn地址
    cdnHost: {
      prodTest: '1995郭靖 test production cdn ',
      production: '1995郭靖 production cdn',
    },
    // cdn仓库名称
    cdnBucket: {
      prodTest: 'guojing1995-test bucket name',
      production: 'guojing1995 production bucket name'
    },
    ak: '1995郭靖***ak',
    sk: '1995郭靖***sk'
  }
}