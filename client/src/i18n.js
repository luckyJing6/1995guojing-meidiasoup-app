/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 16:16:58 
 * @Last Modified by:   郭靖 
 * @Last Modified time: 2020-05-20 16:16:58 
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import langs from './lang'
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh',
  messages: langs
})

export default i18n