/*
 * @Author: 郭靖 
 * @Date: 2020-06-15 15:46:26 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-12 11:07:42
 */
import { mapGetters } from 'vuex'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    speaker: {
      type: Boolean,
      default: false
    },
    // 摄像头
    ownerWebcanPaused: {
      type: Boolean,
      default: false
    },
    // 语音
    ownerMicPaused: {
      type: Boolean,
      default: false
    },
    muted: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isOwner() {
      return this.data.id === this.userInfo.userId
    },
    isPaused() {
      if (this.data.id === this.userInfo.userId)
        return { audio: this.ownerMicPaused, video: this.ownerWebcanPaused }
      const pdata = { audio: false, video: false }
      for (const cid of this.data.consumers) {
        const consumer = this.consumers[cid]
        if (consumer && consumer.kind === 'audio') {
          pdata.audio = consumer.paused
        }
        if (consumer && consumer.kind === 'video') {
          pdata.video = consumer.paused
        }
      }
      return pdata
    },
    fixedVueAudioMutedBug() {
      const isMuted = this.muted || this.data.muted
      this.$nextTick(() => {
        const audio = this.$refs.audio
        if (audio)
          audio.muted = isMuted
      })
      return isMuted
    },
    ...mapGetters(['userInfo', 'consumers', 'producers'])
  },
  methods: {
    mutedTap() {
      this.$emit('iconMuteTap', this.data)
    },
    // 设置stream
    mixinSetElementStream(consumer) {
      const el = this.$refs[consumer.kind]
      if (el) {
        const stream = new MediaStream()
        stream.addTrack(consumer.track)
        el.srcObject = stream
        if (typeof this.setStreamCbs === 'function')
          this.setStreamCbs(consumer)
      }
    }
  },
  watch: {
    'data.consumers': function (vals) {
      if (this.data.id === this.userInfo.userId)
        return
      for (const cid of vals) {
        const consumer = this.consumers[cid]
        if (consumer) {
          this.mixinSetElementStream(consumer)
        }
      }
    }
  }
}