/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 16:17:04 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-13 22:47:18
 */
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import DataBase from 'models/db'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this._listenWindowRefresh()
  },
  methods: {
    // 页面刷新
    _listenWindowRefresh() {
      // 判断是否过期，过期则清空当前缓存
      DataBase.clearWindowRefrshData()
      window.onbeforeunload = () => {
        let data = {
          userInfo: { ...this.userInfo },
          time: new Date().getTime()
        }
        DataBase.setWindowRefreshData(data)
      }
    }
  }
}
</script>

<style>
</style>
