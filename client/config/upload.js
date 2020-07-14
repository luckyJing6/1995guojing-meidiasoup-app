/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 15:56:50 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-05-20 16:02:41
 */
const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')
/*
    1 安装 npm install 七牛
    2.配置 config 文件
      1. host: xxxx 地址
      2. ak: 七牛的Ak
      3. sk: 七牛的Sk
      4. bucket: 新建空间名称
    3.两中上传方式
      1.客户端上传
      2.服务端上传（采用）
    4.新建mac(ak, sk)对象
*/
const cdnConfig = require('./cdn').cdn

const { ak, sk, bucket } = cdnConfig

var mac = new qiniu.auth.digest.Mac(ak, sk)
const config = new qiniu.conf.Config();

config.zone = qiniu.zone.Zone_z2;

const doUpload = (key, file) => {
  const options = {
    scope: bucket + ':' + key
  }
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, file, putExtra, (err, body, info) => {
      if (err) {
        return reject(err)
      }
      if (info.statusCode === 200) {
        resolve(body)
      } else {
        reject(body)
      }
    })
  })
}

const publicPath = path.join(__dirname, '../dist')
const uploadAll = (dir, prefix) => {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const key = prefix ? `${prefix}/${file}` : file
    if (fs.lstatSync(filePath).isDirectory()) {
      return uploadAll(filePath, key)
    }
    doUpload(key, filePath).then(resp => console.log(resp))
      // eslint-disable-next-line no-console
      .catch(err => console.log(err))
  })
}
// 上传文件
uploadAll(publicPath)


