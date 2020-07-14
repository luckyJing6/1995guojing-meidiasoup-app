/*
 * @Author: 郭靖 
 * @Date: 2020-05-28 15:44:38 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-12 11:52:59
 */
import Message from 'base/ggl-message'
import { Device } from 'mediasoup-client'
import Peer from './peer'
import EventEmitter from './event-emitter'
import store from '../store'

// 发送轨道约束条件
const PC_PROPRIETARY_CONSTRAINTS = {
  optional: [{ googDscp: true }]
}

// 视频分辨率
const VIDEO_CONSTRAINS = {
  qvga: { width: { ideal: 160 }, height: { ideal: 120 } },
  vga: { width: { ideal: 640 }, height: { ideal: 480 } },
  hd: { width: { ideal: 1280 }, height: { ideal: 720 } }
}
export default class RoomClient extends EventEmitter {
  /**
   * 
   * @param {Object} param0 
   * - 
   * - id            String 房间id
   * - peer          Object 客户端实例
   * - data          Object 房间的扩展属性(房间名称，简介等)
   * - produce       Bool 是否为生产者
   * - consume       Bool 是否为消费者
   * - h264          Bool h264编码
   * - vp9           Bool vp9编码
   * - resolution    String 视频分辨率
   * - simulcast     Bool 联播模式(发送三路流)    
   */
  constructor({ id, peer, data, produce = true, consume = true, resolution = 'vga', h264 = false, vp9 = false, simulcast = false }) {
    super()

    this.id = id
    this.peer = peer // 自己
    this.data = data
    this.h264 = h264
    this.vp9 = vp9
    this.simulcast = simulcast // 多路流
    this.produce = produce
    this.consume = consume
    this.resolution = resolution

    // 房间是否关闭
    this.closed = false
    // 房间内的其他用户
    this.otherPeers = []
    // 房间内的消费者
    this.consumers = new Map()
    // 发送通道
    this.sendTransport = null
    // 接收通道
    this.recvTransport = null
    // 音频生产者
    this.micProducer = null
    // 视频生产者
    this.webcanProducer = null
    // 本地的所有摄像头设备
    this.webcans = new Map()
    // 本地选中的摄像头
    this.webcan = { deviceId: null }
    // 本地的所有麦克风设备
    this.mics = new Map()
    // 本地选中的mic
    this.mic = { deviceId: null }
  }

  /**
   * 创建实例
   * @param {*} param0 
   * -
   * - peerid       客户端id
   * - peerData     客户端其他参数如(名称，头像地址等)
   */
  static async create({ id, data, produce = true, consume = true, resolution = 'vga', h264 = false, vp9 = false, simulcast = false, peerId, peerData }) {
    const peer = await Peer.create({ id: peerId, data: peerData })
    return new RoomClient({
      id,
      peer,
      data,
      produce,
      consume,
      h264,
      vp9,
      resolution,
      simulcast
    })
  }

  /**
   * 通知服务端创建房间
   * 调用者进行try-catch普获创建成功失败
   */
  async serverCreateRoom() {
    try {
      await this.peer.once({
        cmd: 'createRoom',
        data: {
          id: this.id,
          data: this.data,
          h264: this.h264,
          vp9: this.vp9,
          peerId: this.peer.id,
          peerData: this.peer.data
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   *  加入房间
   */
  async join() {
    // 与房间建立连接
    try {
      const roomInfo = await this.peer.once({
        cmd: 'connectionRoom',
        data: {
          peerId: this.peer.id,
          roomId: this.id,
          peerData: this.peer.data
        }
      })
      // 设置房间基本信息
      store.dispatch('setRoomInfo', roomInfo)
      // 设置owner
      store.dispatch('setOwner', this.peer)
      // 监听服务端通知
      this._handleServerNotice()
      // 加入房间
      await this._joinRoom()
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * 关闭
   */
  async close() {
    if (this.closed)
      return

    this.closed = true

    // peer close
    this.peer.close()

    // clear vuex
    store.dispatch('clear')

    // close sender
    if (this.sendTransport)
      this.sendTransport.close()

    // close recv
    if (this.recvTransport)
      this.recvTransport.close()
  }

  /**
   * 打开摄像头
   */
  async enableWebcan() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
      throw new Error('无法访问摄像头设备')
    // 更新设备
    await this._updateWebcans()
    // 获取轨
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        deviceId: this.webcan.deviceId,
        ...VIDEO_CONSTRAINS[this.resolution]
      }
    })
    const track = await stream.getVideoTracks()[0]
    // 创建produce
    if (!this.simulcast) {
      this.webcanProducer = await this.sendTransport.produce({ track })
    }
    // 将生产者加入到store中
    store.dispatch('addProducer', this.webcanProducer)
    // 监听事件
    this.webcanProducer.on('transportclose', () => {
      store.dispatch('deleteProducer', { id: this.webcanProducer.id })
      this.webcanProducer = null
    })
    this.webcanProducer.on('trackended', () => {
      console.log('webcanProducer 所在track关闭')
    })
  }

  /**
   * 关闭摄像头
   */
  async disableWebcan() {
    await this._closeProducer(this.webcanProducer)
  }

  /**
   * 处理摄像头暂停/关闭
   */
  async tagglePauseWebcan() {
    await this._tagglePauseProducer(this.webcanProducer)
  }

  /**
   * 暂停摄像头
   */
  async pauseWebcan() {
    await this._producerPause(this.webcanProducer)
  }

  /**
   * 恢复摄像头
   */
  async resumeWebcan() {
    await this._producerResume(this.webcanProducer)
  }

  /**
   * 改变视频分辨率
   * @param {String} resolution 分辨率
   */
  async changeWebcamResolution(resolution) {
    if (!this.webcanProducer)
      throw new Error('摄像头生产者不存在')

    const r = VIDEO_CONSTRAINS[resolution]
    if (!r)
      throw new Error('分辨率格式不存在')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          deviceId: this.webcan.deviceId,
          ...VIDEO_CONSTRAINS[this.resolution]
        }
      })
      const track = await stream.getVideoTracks()[0]

      await this.webcanProducer.replaceTrack({ track })

      store.dispatch('replaceTrack', { id: this.webcanProducer.id, track })
    } catch (error) {
      console.error(error)
      throw new Error('修改分辨率失败' + error)
    }
  }

  /**
   * 打开麦克风
   */
  async enableMic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
      throw new Error('无法访问麦克风设备')
    // 设置麦克风
    await this._updateMics()
    // 获取流
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: {
        deviceId: this.mic.deviceId,
        echoCancellation: true, // 回音消除
        noiseSuppression: true // 降噪
      }
    })
    // 获取轨
    const track = stream.getAudioTracks()[0]
    console.log(this.sendTransport)
    // 创建生产者
    this.micProducer = await this.sendTransport.produce({
      track,
      codecOptions: {
        opusStereo: 1,
        opusDtx: 1
      }
    })
    // 添加micProducer到vuex中
    store.dispatch('addProducer', this.micProducer)
    // 监听事件
    this.micProducer.on('transportclose', () => {
      store.dispatch('deleteProducer', { id: this.micProducer.id })
      this.micProducer = null
    })
    this.micProducer.on('trackended', () => {
      console.log('micproducer 所在track关闭')
    })
  }

  /**
   * 关闭麦克风
   */
  async disableMic() {
    await this._closeProducer(this.micProducer)
  }

  /**
   * 处理麦克暂停/关闭
   */
  async tagglePauseMic() {
    const roomInfo = store.getters.roomInfo
    if (roomInfo.paused && roomInfo.creater !== this.peer.id)
      return Message.error('房间被禁言，无法设置麦克风')
    await this._tagglePauseProducer(this.micProducer)
  }

  /**
   * 暂停麦克风
   */
  async pauseMic() {
    await this._producerPause(this.micProducer)
  }

  /**
   * 恢复麦克风
   */
  async resumeMic() {
    await this._producerResume(this.micProducer)
  }

  /**
   * 处理房间麦克暂停/关闭
   */
  async taggleRoomPauseMic() {
    const paused = store.getters.roomInfo.paused
    if (paused)
      await this.resumeRoomMic()
    else
      await this.pauseRoomMic()
  }

  /**
   * 全体暂停麦克风
   */
  async pauseRoomMic() {
    try {
      await this.peer.once({
        cmd: 'pauseRoomAudio',
        data: { id: this.peer.id }
      })
    } catch (error) {
      Message.error(error)
      throw new Error(error)
    }
  }

  /**
   * 全体解禁麦克风
   */
  async resumeRoomMic() {
    try {
      await this.peer.once({
        cmd: 'resumeRoomMic',
        data: { id: this.peer.id }
      })
    } catch (error) {
      Message.error(error)
      throw new Error(error)
    }
  }

  /**
   * 重新传输ice
   */
  async restartIce() {
    try {
      if (this.sendTransport)
        await this._handleRestartIce(this.sendTransport)

      if (this.recvTransport)
        await this._handleRestartIce(this.recvTransport)

      Message.success('ICE重新连接成功')
    } catch (error) {
      Message.error(error)
      throw new Error(error)
    }
  }

  async getLocalConsumerStats(id) {
    const consumer = this.consumers.get(id)
    if (!consumer)
      throw new Error('消费者不存在')
    return await consumer.getStats()
  }

  /**
   * 处理重新连接ice
   * @param {webrtcTransport} transport 
   */
  async _handleRestartIce(transport) {
    const iceParameters = await this.peer.once({
      cmd: 'restartIce',
      data: {
        transportId: transport.id
      }
    })
    await transport.restartIce({ iceParameters })
  }

  /**
   * 处理生产者暂停/关闭
   * @param {Object} producer 生产者
   */
  async _tagglePauseProducer(producer) {
    const paused = producer.paused
    console.log('处理生产者 --->', paused)
    if (!paused)
      await this._producerPause(producer)
    else
      await this._producerResume(producer)
  }

  /**
   * 暂停生产者
   * @param {Object} producer 生产者
   */
  async _producerPause(producer) {
    try {
      await producer.pause()
      await this.peer.once({
        cmd: 'producerPause',
        data: {
          producerId: producer.id
        }
      })
      this._storeProducerPaused(producer.id, true)
    } catch (error) {
      Message.error(error)
      throw new Error(error)
    }
  }

  /**
   * 恢复生产者
   * @param {Object} producer 生产者
   */
  async _producerResume(producer) {
    try {
      await producer.resume()
      await this.peer.once({
        cmd: 'producerResume',
        data: {
          producerId: producer.id
        }
      })
      this._storeProducerPaused(producer.id, false)
    } catch (error) {
      Message.error(error)
      throw new Error(error)
    }
  }

  /**
   * 更新所有摄像头
   */
  async _updateWebcans() {
    await this._handleDevice('videoinput', this.webcans, this.webcan, '摄像头不存在')
  }

  /**
   * 更新所有麦克风
   */
  async _updateMics() {
    await this._handleDevice('audioinput', this.mics, this.mic, '麦克风不存在')
  }

  /**
   * 关闭生产者
   * @param {Object} producer 生产者
   */
  async _closeProducer(producer) {
    if (!producer)
      throw new Error('设备未启用，无法关闭')
    // 关闭生产者
    await producer.close()
    // 通知服务端关闭生产者
    try {
      await this.peer.once({
        cmd: 'closeProducer',
        data: {
          producerId: producer.id
        }
      })
    } catch (error) {
      Message.error(error)
      throw new Error(error)
    }
    // 移除store中对应生产者数据
    store.dispatch('deleteProducer', { id: producer.id })
    producer = null
  }

  /**
   * 设置处理设备
   * @param {*} kind 
   * @param {*} data 
   * @param {*} selectData 
   * @param {*} msg 
   */
  async _handleDevice(kind, data, selectData, err) {
    data = await this._getLocalDevice(kind)
    // 设置选中的mic
    const mics = Array.from(data.values())
    if (mics.length <= 0)
      throw new Error(err)
    const selectIndex = mics.findIndex(item => item.deviceId === selectData.deviceId)
    if (selectIndex < 0)
      selectData.deviceId = mics[0].deviceId
  }

  /**
   * 获取对应kind的所有的本地设备
   * @param { String } kind 设备类型
   */
  async _getLocalDevice(kind) {
    let data = new Map()
    let devices = await navigator.mediaDevices.enumerateDevices()
    for (const device of devices) {
      if (device.kind === kind)
        data.set(device.deviceId, device)
    }
    return data
  }

  /**
   * 处理服务端通知
   */
  _handleServerNotice() {
    // 有新客户端加入进来
    this.peer.socket.on('newPeer', peer => {
      console.log('监听到有新客户端', peer)
      store.dispatch('addOnePeer', peer)
    })
    // 接收到新的消费者
    this.peer.socket.on('newConsumer', async data => {
      const { producerPeerId, producerId, id, kind, rtpParameters, type, appData, paused, score } = data
      // 创建消费者
      const consumer = await this.recvTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        appData
      })
      // 将消费者添加cou
      this.consumers.set(consumer.id, consumer)
      // 添加消费者
      store.dispatch('addConsumer', {
        id,
        producerId,
        producerPeerId,
        kind,
        appData,
        type,
        score,
        paused,
        rtpParameters: consumer.rtpParameters,
        track: consumer.track
      })
      // 监听事件
      consumer.on('transportclose', () => {
        store.dispatch('deleteConsumer', { id: consumer.id })
      })
    })
    // 监听到消费者所在的生产者关闭
    this.peer.socket.on('consumerProducerClosed', async data => {
      console.log('监听到消费者所在的生产者关闭', data)
      store.dispatch('deleteConsumer', { id: data.id, peerId: data.peerId })
    })
    // 监听到消费者暂停
    this.peer.socket.on('consumerPause', async data => {
      console.log('监听到消费者所在的生产者暂停', data)
      store.dispatch('setConsumerPaused', {
        id: data.id,
        paused: true
      })
    })
    // 监听到消费者恢复
    this.peer.socket.on('consumerResume', async data => {
      console.log('监听到消费者恢复', data)
      store.dispatch('setConsumerPaused', {
        id: data.id,
        paused: false
      })
    })
    // 监听房主更新
    this.peer.socket.on('roomCreater', async data => {
      const { id } = data
      store.dispatch('setRoomCreater', id)
    })
    // 监听到房间禁言状态改变
    this.peer.socket.on('roomPausedChange', async data => {
      store.dispatch('setRoomPaused', data.paused)
      console.log('监听到房间禁言状态改变')
    })
    // 监听到房间说话人及音量发生变化
    this.peer.socket.on('speaker', async data => {
      const { id, volume } = data
      // store.dispatch('setSpeaker', { id, volume })
    })
    // 监听到用户离开房间
    this.peer.socket.on('peerClosed', async data => {
      const { id } = data
      // 移除用户
      store.dispatch('deletePeer', { id })
    })
  }

  /**
   * 加入房间
   */
  async _joinRoom() {
    try {
      // 获取服务端房间router的rtp能力
      const routerRtpCapabilities = await this.peer.once({
        cmd: 'routerRtpCapabilities'
      })
      console.log('服务端rtp', routerRtpCapabilities)
      // 创建device
      const device = new Device()
      // 加载远程rtpCapabilities
      await device.load({ routerRtpCapabilities })
      // 创建生产者轨道
      if (this.produce) {
        try {
          // 通知服务端创建webrtcTransport
          const req = await this.peer.once({
            cmd: 'createWebrtcTransport',
            data: {
              produce: true,
              consume: false
            }
          })
          console.log('通知服务端创建webrtcTransport', req)
          const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = req
          // 创建发送通道
          this.sendTransport = await device.createSendTransport({
            id,
            iceParameters,
            dtlsParameters,
            iceCandidates,
            sctpParameters
          })
          // 监听事件
          this.sendTransport.on('connect', async ({ dtlsParameters }, cb, errback) => {
            try {
              // 一般用于通知服务器房间路由对应的webrtcTransport进行连接
              await this.peer.once({
                cmd: 'webrtcTransportConnect',
                data: {
                  dtlsParameters,
                  transportId: this.sendTransport.id
                }
              })
              cb() // 必须执行
            } catch (error) {
              console.error('通知服务端transprot进行连接失败')
              errback(error)
            }
          })
          this.sendTransport.on('produce', async (parameters, callback, errback) => {
            const { kind, rtpParameters, appData } = parameters
            try {
              // 业务处理
              const req = await this.peer.once({
                cmd: 'produce',
                data: {
                  appData,
                  kind,
                  rtpParameters,
                  transportId: this.sendTransport.id
                }
              })
              // end
              callback({ id: req.id }) // 必须执行
            } catch (error) {
              console.error('通知服务端创建生产者失败', error)
              errback(error)
            }
          })
        } catch (error) {
          console.error('通知服务端创建produce标记的webrtcTransport 失败', error)
        }
      }
      // 创建消费者轨道
      if (this.consume) {
        try {
          // 通知服务端创建标记为consume的webrtcTransport
          const req = await this.peer.once({
            cmd: 'createWebrtcTransport',
            data: {
              produce: false,
              consume: true
            }
          })
          const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = req
          // 创建发生数据通道
          this.recvTransport = await device.createRecvTransport({
            id,
            iceParameters,
            dtlsParameters,
            iceCandidates,
            sctpParameters
          })
          // 监听函数
          this.recvTransport.on('connect', async ({ dtlsParameters }, cb, errback) => {
            try {
              // 一般用于通知服务器房间路由对应的webrtcTransport进行连接
              await this.peer.once({
                cmd: 'webrtcTransportConnect',
                data: {
                  dtlsParameters,
                  transportId: this.recvTransport.id
                }
              })
              cb() // 必须执行
            } catch (error) {
              console.error('通知服务端transprot进行连接失败')
              errback(error)
            }
          })
        } catch (error) {
          console.error('通知服务端创建produce标记的webrtcTransport 失败', error)
        }
      }

      // 加入房间
      try {
        const { rtpCapabilities, sctpCapabilities } = device
        const peers = await this.peer.once({
          cmd: 'join',
          data: {
            rtpCapabilities,
            sctpCapabilities
          }
        })
        store.dispatch('addPeers', peers)
      } catch (error) {
        console.log('用户加入房间失败', error)
      }
    } catch (error) {
      console.error('获取服务端房间router的rtp能力失败', error)
    }
  }

  /**
   * 处理Vuex暂停生产者
   * @param {String} id 生产者id
   * @param {Boolean} bool 是否暂停
   * 
   */
  _storeProducerPaused(id, bool) {
    store.dispatch('setProducerPaused', {
      id,
      paused: bool
    })
  }
}
