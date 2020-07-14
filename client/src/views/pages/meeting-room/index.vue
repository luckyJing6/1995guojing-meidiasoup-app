/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 16:53:13 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-12 12:12:56
 */
<template>
  <app-room
    webcan
    @back="back"
    @handleRoomMuted="handleRoomMuted"
    @handleMicPause="handleMicPause"
    @taggleRoomPaused="taggleRoomPaused"
    @handleRoomWebcan="handleRoomWebcan"
    @restartIce="restartIce"
  >
    <div slot="leftControl">
      <ggl-button
        class="ggl-margin-btm-20"
        @click="changeVideoResolution"
        type="success"
        shadow
        circle
      >{{resolutionText}}</ggl-button>
    </div>
    <div slot-scope="propsData">
      <div class="otherpeer">
        <meeting-peer
          :class="[roomInfo.creater === peer.id? 'creater': 'peer']"
          v-for="peer in otherPeers"
          :speaker="roomInfo.speakerId === peer.id"
          :ownerMicPaused="propsData.pausedData.audio"
          :ownerWebcanPaused="propsData.pausedData.video"
          :data="peer"
          :key="peer.id"
          :muted="roomInfo.muted"
          @iconMuteTap="tagglePeerMuted"
          @getStatsTap="getStatsTap"
        ></meeting-peer>
      </div>
      <ggl-modal center title="温馨提示" ref="modal">
        <div class="ggl-text-center" slot="content">
          <div class="ggl-margin-btm-20">请选则视频格式</div>
          <ggl-button
            class="ggl-margin-0-10"
            v-for="item in resolutionOptions"
            @click="selectResolutionTap(item)"
            :key="item.value"
            type="primary"
          >{{item.text}}</ggl-button>
        </div>
        <div slot="footer"></div>
      </ggl-modal>
    </div>
  </app-room>
</template>

<script>
import AppRoom from 'components/app-room'
import MeetingPeer from 'components/meeting-peer'
import roomMixin from 'common/mixins/room'
import { mapGetters } from 'vuex'
export default {
  mixins: [roomMixin],
  data() {
    return {
      resolutionText: '标清',
      resolutionOptions: []
    }
  },
  computed: {
    ...mapGetters(['roomInfo', 'otherPeers'])
  },
  created() {
    this._initUIView()
  },
  mounted() {
    this._showEntryModal({
      icon: 'video',
      title: '欢迎来到会议室',
      prefix: 'meeting',
      cb: async () => {
        await this.enableWebcan()
      },
      options: {
        h264: true
      }
    })
  },
  methods: {
    // 打开摄像头
    async enableWebcan() {
      await this.room.enableWebcan()
    },
    // 关闭/打开摄像头
    async handleRoomWebcan() {
      await this.room.tagglePauseWebcan()
    },
    // 改变视频格式
    async changeVideoResolution() {
      this.$refs.modal.show()
    },
    // 选中对应的视频格式
    async selectResolutionTap(item) {
      try {
        this.$refs.modal.close()
        await this.room.changeWebcamResolution(item.value)
        this.resolutionText = item.text
      } catch (error) {
        this.$Message.error(error)
      }
    },
    // 获取消费者统计信息
    async getStatsTap(data) {
      const consumers = data.consumers
      try {
        for (const key in consumers) {
          if (consumers.hasOwnProperty(key)) {
            const element = consumers[key];
            const stats = await this.room.getLocalConsumerStats(element)
            console.log('统计信息', stats, Array.from(stats.values()))
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * ui
     */
    _initUIView() {
      // init options
      this._initOptions()
    },
    // init options
    _initOptions() {
      // init video resolution options
      this.resolutionOptions = [
        { text: '超清', value: 'hd' },
        { text: '高清', value: 'vga' },
        { text: '标清', value: 'qvga' }
      ]
    }
  },
  components: {
    AppRoom,
    MeetingPeer
  }
}
</script>

<style lang="stylus" scoped>
.otherpeer
  text-align center
  width 1000px
  max-height calc(100vh - 120px)
  margin 40px auto
  overflow-y scroll
  .peer
    margin 20px
</style>