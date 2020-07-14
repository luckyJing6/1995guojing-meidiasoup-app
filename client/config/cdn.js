/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 15:56:40 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-05-20 16:03:47
 */

const { cdnConfig } = require('./config')
const { cdnHost, cdnBucket, ak, sk } = cdnConfig

// 注意环境变量VUE_APP_BUILD_ENV要在src中使用必须使用VUE_APP开头
let BUILD_ENV = process.env.VUE_APP_BUILD_ENV

// eslint-disable-next-line no-console
console.log('打包编译的模式为----->>>>>', BUILD_ENV)

let host = cdnHost[BUILD_ENV]
let bucket = cdnBucket[BUILD_ENV]
// console.log('打包方式', BUILD_ENV, 'host', host, 'bucket', bucket)
module.exports = {
  cdn: {
    host,
    bucket,
    ak,
    sk
  }
}
