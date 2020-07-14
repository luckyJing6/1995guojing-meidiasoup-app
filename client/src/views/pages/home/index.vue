/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 16:50:53 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-10 23:19:16
 */
<template>
  <app-bg-page>
    <div class="content">
      <div class="ggl-font-20 ggl-margin-btm-20">游戏大厅</div>
      <div class="ggl-text-center">
        <ggl-button
          round
          shadow
          class="ggl-margin-10"
          type="primary"
          v-for="item in gameList"
          :key="item.page"
          :to="item.path"
          :disabled="item.disabled"
        >{{item.title}}</ggl-button>
      </div>
    </div>
    <ggl-button class="out" shadow circle @click="outTap" type="error" icon="error"></ggl-button>
  </app-bg-page>
</template>

<script>
import AppBgPage from 'components/app-bg-page'
export default {
  data() {
    return {
      gameList: []
    }
  },
  created() {
    this._initUIView()
  },
  methods: {
    /**
     * 事件
     */
    // 推出
    outTap() {
      this.$router.back()
    },
    // 点击某个游戏
    gameItemTap(item) {
      this.$router.push(`/page/${item.path}`)
    },
    /**
     * ui
     */
    _initUIView() {
      // init game list
      this._initGameList()
    },
    // init game list
    _initGameList() {
      this.gameList = [
        { path: 'voice-room', title: '语音房' },
        { path: 'meeting-room', title: '多人会议' },
        { path: 'undercover-game', title: '谁是卧底', disabled: true }
        // { path: 'fird-game', title: '多人声控游戏', disabled: true }
      ]
    }
  },
  components: {
    AppBgPage
  }
}
</script>

<style lang="stylus" scoped>
.content
  color white
  position absolute
  text-align center
  width 100%
  top 35%
  left 50%
  transform translate3d(-50%, -50%, 0)
.out
  position fixed
  bottom 60px
  right 50px
</style>