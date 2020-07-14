/*
 * @Author: 郭靖 
 * @Date: 2020-06-12 18:41:01 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-10 23:13:33
 */
<template>
  <app-bg-page>
    <div>
      <slot :pausedData="isPaused"></slot>
    </div>
    <ggl-button round class="roomId" type="success" shadow>房间号: {{roomInfo.id}}</ggl-button>
    <div class="peer-control">
      <ggl-button
        class="ggl-margin-btm-20"
        @click="restartIce"
        type="success"
        shadow
        circle
        icon="link"
      ></ggl-button>
      <ggl-button
        class="ggl-margin-btm-20"
        @click="handleRoomMuted"
        :type="roomInfo.muted ?  'warning': 'success'"
        shadow
        circle
        :icon="roomInfo.muted ? 'muted': 'laba'"
      ></ggl-button>
      <ggl-button
        class="ggl-margin-btm-20"
        @click="handleMicPause"
        :type="isPaused.audio ?  'warning': 'success'"
        shadow
        circle
        :icon="isPaused.audio ? 'jingyin':'yuyin'"
      ></ggl-button>
      <ggl-button
        class="ggl-margin-btm-20"
        v-if="webcan"
        @click="handleRoomWebcan"
        :type=" isPaused.video ?  'warning': 'success'"
        :icon=" isPaused.video ? 'close-video': 'video'"
        shadow
        circle
      ></ggl-button>
      <slot name="leftControl"></slot>
    </div>
    <div class="creater-control">
      <ggl-button
        v-if="userInfo.userId === roomInfo.creater"
        @click="taggleRoomPaused"
        :type="roomInfo.paused ? 'warning':'primary'"
        shadow
        round
      >{{ roomInfo.paused ? '全体解禁':'全体禁言'}}</ggl-button>
    </div>
    <div class="back">
      <ggl-button icon="home" circle @click="back" type="primary" shadow></ggl-button>
    </div>
  </app-bg-page>
</template>

<script>
import AppBgPage from 'components/app-bg-page'
import { mapGetters } from 'vuex'
export default {
  props: {
    webcan: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    isPaused() {
      const pauseData = { audio: false, video: false }
      for (const key in this.producers) {
        const element = this.producers[key];
        if (element.kind === 'audio')
          pauseData.audio = element.paused
        else
          pauseData.video = element.paused
      }
      if (this.roomInfo.paused && this.userInfo.userId !== this.roomInfo.creater) {
        pauseData.audio = true
      }
      return pauseData
    },
    ...mapGetters(['userInfo', 'roomInfo', 'producers'])
  },
  methods: {
    // 返回
    back() {
      this.$emit('back')
    },
    // 重新连接ICE
    restartIce() {
      this.$emit('restartIce')
    },
    // 摄像头
    handleRoomWebcan() {
      this.$emit('handleRoomWebcan')
    },
    // 禁音
    handleRoomMuted() {
      this.$emit('handleRoomMuted')
    },
    // mic tap
    handleMicPause() {
      this.$emit('handleMicPause')
    },
    // 全体禁言
    taggleRoomPaused() {
      this.$emit('taggleRoomPaused')
    }
  },
  components: {
    AppBgPage
  }
}
</script>

<style lang="stylus" scoped>
.title
  color white
  margin-top 40px
  text-align center
  font-size 20px
  font-weight 500
.back
  position fixed
  bottom 70px
  right 50px
.creater-control
  position fixed
  bottom 70px
  left 50%
  transform translateX(-50%)
.peer-control
  position fixed
  left 10px
  top 45%
  transform translateY(-50%)
  width 50px
  text-align center
.roomId
  position fixed
  top 25px
  right 30px
</style>