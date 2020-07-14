/*
 * @Author: 郭靖 
 * @Date: 2020-03-20 16:29:34 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-11 13:37:02
 */
const BUILD_ENV = process.env.VUE_APP_BUILD_ENV

// api 请求地址
const ips = {
  development: '/api/v1',
  prodNoCdn: 'http://***.**.**.***:****/prodNoCdn',
  prodTest: 'http://***.**.**.***:****/prodTest',
  production: 'http://***.**.**.***:****/production'
}
const CONNET_IP = ips[BUILD_ENV]

const buildTypeIps = {
  ip: `${CONNET_IP}`,
  privateImageAction: `${CONNET_IP}/common/file/oss/private`,
  openImageAction: `${CONNET_IP}/common/file/oss/public`,
  openFileAction: `${CONNET_IP}/common/file/oss/public`,
  privateFileAction: `${CONNET_IP}/common/file/oss/private`
}
export const ip = buildTypeIps.ip
// oss公共图片的静态资源地址
export const openImageAction = buildTypeIps.openImageAction
// oss私有图片
export const privateImageAction = buildTypeIps.privateImageAction
// oss私有文件
export const privateFileAction = buildTypeIps.privateFileAction
// oss共有文件
export const openFileAction = buildTypeIps.openFileAction
