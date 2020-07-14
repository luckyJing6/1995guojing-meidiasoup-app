/*
 * @Author: 郭靖 
 * @Date: 2020-05-21 09:35:52 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-10 23:01:02
 */
<template>
  <div class="page">
    <div class="page-moon">
      <app-moon :url="userInfo.headPhoto"></app-moon>
    </div>
    <div>
      <slot></slot>
    </div>
    <div class="footer ggl-flex ggl-flex-center">
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script>
import AppFooter from '../app-footer'
import AppMoon from '../app-moon'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  components: {
    AppFooter,
    AppMoon
  }
}
</script>

<style lang="stylus" scoped>
.page
  width 100vw
  height 100vh
  overflow hidden
  background rgb(5, 23, 81)
  box-sizing border-box
  position relative
  .page-moon
    position absolute
    top 20px
    left 20px
  .footer
    position absolute
    bottom 20px
    color white
    width 100%
    padding 0 10px
</style>