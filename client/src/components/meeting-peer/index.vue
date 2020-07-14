/*
 * @Author: 郭靖 
 * @Date: 2020-06-15 11:44:44 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-13 22:10:15
 */
<template>
  <div class="meeting-peer">
    <video :class="videoClass" ref="video" autoplay playinline muted></video>
    <div v-show="videoInfo" class="info">视频加载中</div>
    <ggl-avatar
      :circle="false"
      v-show="isPaused.video"
      class="avatar"
      :src="data.headPhoto"
      size="200"
    ></ggl-avatar>
    <div :style="textStyle" class="ggl-margin-top-10 ggl-flex ggl-flex-align ggl-flex-center">
      <ggl-icon size="18" :type=" isPaused.audio ? 'jingyin' : 'yuyin'"></ggl-icon>
      <span class="ggl-margin-0-10" :style="{color: isOwner ? 'yellow': ''}">{{data.name}}</span>
      <ggl-icon
        :class="[speaker ? 'speaker': '']"
        size="18"
        :type=" fixedVueAudioMutedBug ? 'muted': 'laba'"
        @click="mutedTap"
      ></ggl-icon>
      <ggl-icon
        class="ggl-margin-0-10"
        size="18"
        type="info"
        @click="getStats"
      ></ggl-icon>
    </div>
    <audio ref="audio" autoplay></audio>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import peerMixin from 'common/mixins/peer'
export default {
  mixins: [peerMixin],
  data() {
    return {
      videoInfo: true
    }
  },
  computed: {
    videoClass() {
      return [
        'video'
      ]
    },
    textStyle() {
      return {
        color: this.speaker ? '#ff9900' : ''
      }
    },
    ...mapGetters(['producers'])
  },
  methods: {
    // 设置stream回调
    setStreamCbs(consumer) {
      if (consumer.kind === 'video')
        this.videoInfo = false
    },
    // 查看统计信息
    async getStats() {
      this.$emit('getStatsTap', this.data)
    }
  },
  watch: {
    producers: function (v) {
      if (this.data.id === this.userInfo.userId) {
        for (const key in v) {
          const producer = v[key]
          const video = this.$refs.video
          if (producer.kind === 'video' && video) {
            if(video.srcObject) {
              const track = video.srcObject.getVideoTracks()[0]
              if(track === producer.track)
                break  
            }
            console.log('video track change')
            const stream = new MediaStream()
            stream.addTrack(producer.track)
            video.srcObject = stream
            this.videoInfo = false
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.meeting-peer
  text-align center
  color white
  display inline-block
  font-size 12px
  position relative
  .video
    width 200px
    height 200px
    object-fit fill
    background black
    border-radius 5px
  .avatar
    position absolute
    top 0
    left 0
  .info
    position absolute
    top calc(50% - 30px)
    width 100%
    transform translateY(-50%)
    text-align center
    color white
    font-size 14px
    z-index 2
  .speaker
    animation-name animat
    animation-timing-function ease-out
    animation-iteration-count infinite
    animation-direction alternate
    animation-duration 0.5s
  @keyframes animat
    from
      color mix(white, #ff9900, 100%)
    to
      color mix(white, #ff9900, 0)
</style>
