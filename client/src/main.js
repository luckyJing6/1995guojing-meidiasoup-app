/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 16:16:51 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-13 12:34:52
 */
import Vue from 'vue'
import './other-modules'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

// eslint-disable-next-line no-console
Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
