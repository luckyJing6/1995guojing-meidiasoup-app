/*
 * @Author: 郭靖 
 * @Date: 2020-06-01 11:31:51 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-12 11:28:56
 */
import RoomClient from 'models/room-client'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      room: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'roomInfo'])
  },
  methods: {
    // 退出房间
    back() {
      if (typeof this.room.close === 'function')
        this.room.close()
      this.$router.back()
    },
    // 创建RoomClient实例
    async createRoomInstence({ id, data = {}, vp9 = false, h264 = false, simulcast = false }) {
      const { userId, userName, headPhoto } = this.userInfo
      this.room = await RoomClient.create({
        id,
        data,
        vp9,
        h264,
        simulcast,
        peerId: userId,
        peerData: {
          name: userName,
          headPhoto: headPhoto
        }
      })
    },
    // 加入房间
    async joinRoom(id, isCreate, cbs, options) {
      if (!id)
        return this.$Message.error('房间号不能为空')
      try {
        options = options || {}
        await this.createRoomInstence({ id, ...options })
        if (isCreate)
          await this.room.serverCreateRoom()
        await this.room.join()
        await this.room.enableMic()
        cbs && cbs()
      } catch (error) {
        this.$Message.error(error.message)
      }
    },
    // 重新连接ice
    async restartIce() {
      if (this.restarting)
        this.$Message.warning('正在重新连接中...')
      this.restarting = true
      await this.room.restartIce()
      this.restarting = false
    },
    // 暂停恢复mic
    async handleMicPause() {
      await this.room.tagglePauseMic()
    },
    // 全体禁言
    async taggleRoomPaused() {
      await this.room.taggleRoomPauseMic()
    },
    // 静音
    handleRoomMuted() {
      this.setRoomMuted(!this.roomInfo.muted)
    },
    // 切换用户音量
    tagglePeerMuted(data) {
      // 如果是自己则进行提示是否静音
      this.setPeerMuted({
        peerId: data.id,
        muted: !data.muted
      })
    },
    /**
     * ui
     */
    // room id modal
    _showEntryModal({ icon, title, prefix, cb, options }) {
      this.$Modal({
        type: 'prompt',
        icon,
        title,
        content: '请输入房间号',
        okBtnText: '加入房间',
        cancelBtnText: '创建房间',
        cancelBtnType: 'success',
        center: true,
        round: true,
        shadow: true,
        onOkTap: (vm, val) => {
          // 加入房间
          this.joinRoom(`${prefix}-${val}`, false, () => {
            cb && cb()
            vm.remove()
          }, options)
        },
        onCancelTap: (vm, val) => {
          // 创建房间
          this.joinRoom(`${prefix}-${val}`, true, () => {
            cb && cb()
            vm.remove()
          }, options)
        },
        onClose: () => {
          this.back()
        }
      })
    },
    ...mapActions(['setRoomMuted', 'setPeerMuted'])
  }
}