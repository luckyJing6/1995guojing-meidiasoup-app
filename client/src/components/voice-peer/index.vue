/*
 * @Author: 郭靖 
 * @Date: 2020-06-03 15:41:11 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-15 16:04:11
 */
<template>
  <div class="voice-user">
    <ggl-avatar :class="avatarClass" :src="data.headPhoto" size="60"></ggl-avatar>
    <div :style="textStyle" class="ggl-flex ggl-flex-align">
      <ggl-icon size="18" :type="isPaused.audio ? 'jingyin' : 'yuyin'"></ggl-icon>
      <span
        class="ggl-margin-0-5"
        :style="{color: isOwner ? 'yellow': ''}"
      >{{data.name}}</span>
      <ggl-icon size="18" :type=" fixedVueAudioMutedBug ? 'muted': 'laba'" @click="mutedTap"></ggl-icon>
    </div>
    <audio ref="audio" autoplay></audio>
  </div>
</template>

<script>
import peerMixin from 'common/mixins/peer'
export default {
  mixins: [peerMixin],
  data() {
    return {
    }
  },
  computed: {
    avatarClass() {
      return [
        'shadow',
        {
          speaker: this.speaker
        }
      ]
    },
    textStyle() {
      return {
        color: this.speaker ? '#ff9900' : ''
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.voice-user
  text-align center
  color white
  display inline-block
  font-size 12px
  .shadow
    margin-bottom 10px
    box-shadow 0 0 10px white
    &.speaker
      animation-name animat
      animation-timing-function ease-out
      animation-iteration-count infinite
      animation-direction alternate
      animation-duration 0.5s
  @keyframes animat
    from
      box-shadow 0 0 10px mix(white, #ff9900, 100%)
    to
      box-shadow 0 0 20px mix(white, #ff9900, 0)
</style>