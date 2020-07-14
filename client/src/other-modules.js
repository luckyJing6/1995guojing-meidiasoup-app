/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 16:16:45 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-08 16:14:56
 */
import Vue from 'vue'

// styl
import './common/icon-font/iconfont.css'
import './common/stylus/index.styl'

// js
import 'common/js/axios.js'
import 'common/js/date.js'

// 全局批量导入自己的组件
const files = require.context('./base', true, /index.vue$/)
files.keys().forEach(file => {
  const comp = files(file).default
  Vue.component(`${comp.name}`, comp)
})

// 自动extend组件
const extendFiles = require.context('./base', true, /index.js$/)
extendFiles.keys().forEach(file => {
  const comp = extendFiles(file).default
  const k = comp.__$key
  Vue.prototype[k] = comp
})

