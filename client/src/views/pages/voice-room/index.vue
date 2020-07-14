/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 16:54:02 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-16 10:48:41
 */
<template>
  <app-room
    @back="back"
    @handleRoomMuted="handleRoomMuted"
    @handleMicPause="handleMicPause"
    @taggleRoomPaused="taggleRoomPaused"
    @restartIce="restartIce"
  >
    <div slot-scope="propsData" class="otherpeer">
      <voice-peer
        :class="[roomInfo.creater === peer.id? 'creater': 'peer']"
        v-for="peer in otherPeers"
        :speaker="roomInfo.speakerId === peer.id"
        :ownerMicPaused="propsData.pausedData.audio"
        :data="peer"
        :key="peer.id"
        :muted="roomInfo.muted"
        @iconMuteTap="tagglePeerMuted"
      ></voice-peer>
    </div>
  </app-room>
</template>

<script>
import AppRoom from 'components/app-room'
import VoicePeer from 'components/voice-peer'
import roomMixin from 'common/mixins/room'
import { mapGetters } from 'vuex'
export default {
  mixins: [roomMixin],
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['roomInfo', 'otherPeers'])
  },
  mounted() {
    this._showEntryModal({
      icon: 'yuyin',
      title: '欢迎来到语音房',
      prefix: 'vioce'
    })
  },
  components: {
    AppRoom,
    VoicePeer
  }
}
</script>

<style lang="stylus" scoped>
.otherpeer
  text-align center
  width 500px
  margin 130px auto
  margin-bottom 0
  position relative
  .creater
    position absolute
    top -100px
    left 50%
    transform translateX(-50%)
  .peer
    margin 20px
</style>