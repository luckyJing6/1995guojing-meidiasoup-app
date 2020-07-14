/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 17:01:44 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-13 22:54:49
 */
<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import DataBase from 'models/db'
import { mapGetters, mapMutations } from 'vuex'
export default {
  redirect: 'pages/home',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this._initCore()
  },
  methods: {
    /**
     * 基础设置
     */
    _initCore() {
      // 页面刷新后创建时候，获取存储的数据并赋值到对于的vuex上
      this._initVuexData()
    },
    // init vuex
    _initVuexData() {
      if (!this.userInfo.userId) {
        const r = DataBase.getWindowRefreshData()
        if (r.userInfo && r.userInfo.userId)
          // 设置userInfo
          this.setUserInfo(r.userInfo)
        else
          this.$router.push('/login')
      }
    },
    ...mapMutations(['setUserInfo'])
  }
}
</script>

<style lang="stylus" scoped></style>