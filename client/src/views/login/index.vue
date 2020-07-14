/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 16:31:18 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-13 22:20:11
 */
<template>
  <app-bg-page>
    <div class="main">
      <img class="ggl-circle" src="images/github.jpeg" width="70" alt srcset />
      <h1 class="title">1995郭靖开源的音视频实时互动应用</h1>
      <div class="desc ggl-no-wrap">可以用于在线教育，多人会议，社交应用，互动游戏等</div>
      <div class="ggl-margin-top-40">
        <ggl-button @click="loginTap" round shadow type="primary">互动体验</ggl-button>
      </div>
    </div>
  </app-bg-page>
</template>

<script>
import { mapMutations } from 'vuex'
import { randomName } from 'common/js/util'
import AppBgPage from 'components/app-bg-page'
import getHeadPhoto from 'common/js/head-photo'
export default {
  data() {
    return {
    }
  },
  methods: {
    /**
     * 事件
     */
    async loginTap() {
      this.setUserInfo({
        userId: `ggl-${Math.random() * 10000 | 0}`,
        userName: randomName(),
        headPhoto: getHeadPhoto()
      })
      this.$router.push('/pages')
    },
    ...mapMutations(['setUserInfo'])
  },
  components: {
    AppBgPage
  }
}
</script>

<style lang="stylus" scoped>
.main
  position absolute
  top 40%
  left 50%
  transform translate3d(-50%, -50%, 0)
  text-align center
  color white
  .title
    font-size 35px
    text-shadow 0 0 3px white
  .desc
    margin-top 10px
    font-size 22px
    text-shadow 0 0 3px white
  .btn
    display inline-block
    padding 0 20px
    height 35px
    line-height 35px
    border-radius 17.5px
    background #2d8cf0
    text-align center
    color white
    box-shadow 0 0 5px #2d8cf0
</style>