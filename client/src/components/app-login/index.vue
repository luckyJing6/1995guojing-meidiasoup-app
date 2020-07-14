/*
 * @Author: 郭靖 
 * @Date: 2020-05-21 09:35:52 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-05-21 11:18:12
 */
<template>
  <div class="page">
    <div class="ponite-wrap">
      <div class="content app-flex app-flex-align">
        <div class="app-flex-1 app-color-white app-text-center">
          <h1 class="title">1995郭靖开源的音视频实时互动应用</h1>
          <div class="desc app-no-wrap">可以用于在线教育，多人会议，社交应用，游戏等</div>
        </div>
        <div class="app-flex-1">
          <div class="main">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script>
import AppFooter from '../app-footer'
export default {
  data() {
    return {
    }
  },
  components: {
    AppFooter
  }
}
</script>

<style lang="stylus" scoped>
.page
  width 100vw
  height 100vh
  overflow hidden
  background rgb(5, 23, 81)
  .footer
    position absolute
    bottom 5vh
    color white
    width 40%
    left 30%
  .ponite-wrap
    position absolute
    width 100%
    height 60vh
    left 0
    top 20vh
  .content
    width 90%
    margin 0 auto
    height 50vh
    .title
      font-size 35px
      text-shadow 0 0 3px white
    .desc
      margin-top 10px
      font-size 22px
      text-shadow 0 0 3px white
    .main
      width 384px
      margin 0 auto
      .login-wrap
        border-radius 5px
        padding 10px 15px
        box-sizing border-box
        width 100%
        background white
        box-shadow 0 0 5px white


</style>