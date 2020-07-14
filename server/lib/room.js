/*
 * @Author: 郭靖 
 * @Date: 2020-06-01 09:41:51 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-12 11:37:38
 */
const EventEmitter = require('events').EventEmitter
const Logger = require('./logger')
const config = require('../config')
const { SuccessEmit, FailEmit } = require('./helper')
const Peer = require('./peer')

const logger = new Logger('room')

class Room extends EventEmitter {
  /**
   * 
   * @param {Object} param0 
   * -
   * - id                     房间id
   * - router                 房间的mediasoup路由
   * - audioLevelObserver     房间路由内的音量检查器
   * - io                     socket.io
   * - data                   房间的扩展属性(名称，简介等)
   */
  constructor({ id, router, audioLevelObserver, io, data = {} }) {
    super()
    // 设置最大监听者数量，默认不超过10个
    this.setMaxListeners(Infinity)
    this.id = id
    this.router = router
    this.audioLevelObserver = audioLevelObserver
    this.io = io
    this.data = data
    // 是否禁言状态
    this.allPaused = false
    // 房间关闭状态
    this._closed = false
    // 房间内的客户端
    this.peers = new Map()
    // 处理房间内的声音
    this._handleAudioLevelObserver()
  }

  /**
   * 创建Room方法
   * @param {*} param0 
   * -
   * - id         房间id
   * - worker     mediasoupWorker实例
   * - io         socket.io
   * - h264       是否h264编码
   * - vp9        是否vp9编码，优先级比h264高
   * - data       房间其他参数
   */
  static async create({ id, worker, io, h264 = false, vp9 = false, data = {} }) {
    const roomOptions = await Room._initMediasoupRouter({ id, worker, h264, vp9 })
    return new Room({ ...roomOptions, io, data })
  }

  /**
   * 初始化mediasoupRouter
   * @param {*} param0 
   * -
   * - id         房间id
   * - worker     mediasoupWorker实例
   * - io         socket.io
   * - h264       是否h264编码
   * - vp9        是否vp9编码，优先级比h264高
   */
  static async _initMediasoupRouter({ id, worker, h264 = false, vp9 = false }) {
    let { mediaCodecs } = config.mediasoup.routerOptions
    // 如果是h264
    if (h264) {
      mediaCodecs = mediaCodecs
        .filter(item => item.kind === 'audio' || item.mimeType.toLocaleLowerCase() === 'video/h264')
    }
    // 如果是vp9
    if (vp9) {
      mediaCodecs = mediaCodecs
        .filter(item => item.kind === 'audio' || item.mimeType.toLocaleLowerCase() === 'video/vp9')
    }
    // 创建router
    const router = await worker.createRouter({
      mediaCodecs,
      appData: { author: '1995郭靖' }
    })
    // 监听函数
    router.on('workerclose', () => {
      logger.info('room %o 所在的worker已经关闭', id)
    })
    router.observer.on('close', () => {
      logger.info('room %o 关闭', id)
    })
    // 创建音量检查器
    const audioLevelObserver = await router.createAudioLevelObserver({
      maxEntries: 1,
      threshold: -70,
      interval: 1000 // 检查间隔时间1000ms
    })
    return { id, router, audioLevelObserver }
  }

  /**
   * 关闭房间
   */
  close() {
    if (this._closed)
      return
    this._closed = true
    // 关闭router
    this.router.close()
    // emit close event
    this.emit('close')
  }

  /**
   * 处理客户端与房间进行连接
   * @param {*} param0 
   * -
   * - peerId         客户端id
   * - socket         客户端对应socket
   * - peerData       客户端扩展信息
   */
  handlePeerConnection({ peerId, socket, peerData }) {
    // 判断客户端是否已经存在
    let peer = this.peers.get(peerId)
    if (peer && peer.data.jioned) {
      socket.emit('connectionRoom', FailEmit({ msg: '客户端已经加入房间' }))
      return logger.info('客户端 %o 已经加入了房间 %o', peerId, this.id)
    }
    // 创建peer
    peer = new Peer({
      id: peerId,
      socket: socket,
      data: peerData
    })
    // 扩展peer属性
    this._extendPeerData({ peer })
    // 处理peer的监听函数
    this._handlePeerRequest({ peer })
    // 将peer加入到peers中
    this.peers.set(peerId, peer)
    console.log('房间的状态--->>>', this.allPaused)
    // 通知客户端房间信息
    peer.emit('connectionRoom', SuccessEmit({
      data: {
        id: this.id,
        paused: this.allPaused,
        ...this.data
      }
    }))
  }

  /**
   * 处理客户端请求
   * @param {*} param0
   * -
   * - peer      Peer实例 
   */
  _handlePeerRequest({ peer }) {
    // 房间router的rtp能力
    peer.socket.on('routerRtpCapabilities', () => {
      const rtpCapabilities = this.router.rtpCapabilities
      peer.emit('routerRtpCapabilities', SuccessEmit({
        data: rtpCapabilities
      }))
    })

    // 创建webrtcTransport
    peer.socket.on('createWebrtcTransport', async data => {
      const { produce, consume } = data
      const options = config.mediasoup.webRtcTransportOptions
      // 创建webrtcTransport
      const transport = await this.router.createWebRtcTransport({
        ...options,
        appData: {
          produce,
          consume
        }
      })
      // 添加通道
      peer.data.transports.set(transport.id, transport)
      // 监听函数
      transport.on('routerclose', () => {
        logger.info('监听到transport所在的router关闭了')
      })
      transport.on('rclos', () => {
        logger.info('监听到transport %o 关闭了', transport.id)
      })
      peer.emit('createWebrtcTransport', SuccessEmit({
        data: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
          sctpParameters: transport.sctpParameters
        }
      }))
    })

    // 连接webrtcTransport
    peer.socket.on('webrtcTransportConnect', async data => {
      const { dtlsParameters, transportId } = data
      const transport = peer.data.transports.get(transportId)
      if (!transport) {
        logger.error('要连接的webRtcTransport %o 不存在', transportId)
        return peer.emit('webrtcTransportConnect', FailEmit({ msg: '要连接的webRtcTransport不存在' }))
      }
      await transport.connect({ dtlsParameters })
      peer.emit('webrtcTransportConnect', SuccessEmit({}))
    })

    // 加入房间
    peer.socket.on('join', async data => {
      const { rtpCapabilities, sctpCapabilities } = data
      // 设置属性
      peer.data.jioned = true
      peer.data.rtpCapabilities = rtpCapabilities
      peer.data.sctpCapabilities = sctpCapabilities
      // 将用户加入到io对应的room中
      peer.socket.join(this.id)
      // 获取其他已经加入房间的客户端
      const otherPeers = this._getOtherPeers({ excludeId: peer.id })
      // 为该客户端创建消费者
      for (const otherPeer of otherPeers) {
        // 获取其他客户端中的生产者
        const producers = otherPeer.data.producers.values()
        for (const producer of producers) {
          // 创建消费者
          this.createConsumer({
            producer,
            producerPeer: otherPeer,
            consumerPeer: peer
          })
        }
      }
      let peers = this._getOtherPeers({})
      peers = peers.map(item => {
        // 过滤调不必要的属性
        return this._filterPeerExtendProperty({ peer: item })
      })
      // 通知客户端加入房间成功
      peer.emit('join', SuccessEmit({
        data: peers
      }))
      // 通知房间内其他客户端有新客户端进来了
      peer.to(this.id, 'newPeer', this._filterPeerExtendProperty({ peer }))
      logger.info('推送房间 %o 的其他客户端newPeer指令', this.id)
    })

    // 创建生产者
    peer.socket.on('produce', async data => {
      const { appData, kind, rtpParameters, transportId } = data
      const transport = peer.data.transports.get(transportId)
      if (!transport) {
        logger.error('要创建produce的webRtcTransport %o 不存在', transportId)
        return peer.emit('produce', FailEmit({ msg: '要创建produce的webRtcTransport不存在' }))
      }
      // 创建生产者，如果全体禁言音频则paused
      const producer = await transport.produce({
        kind,
        rtpParameters,
        paused: kind === 'audio' ? this.allPaused : false,
        appData: {
          ...appData,
          peerId: peer.id
        }
      })

      logger.info('创建的生产者----->>>> %o', producer.id)
      // 添加produce
      peer.data.producers.set(producer.id, producer)
      // 监听函数
      producer.on('transportclose', () => {
        logger.info('produce所在的transport关闭')
        peer.data.producers.delete(producer.id)
      })
      producer.on('score', score => {
        // 当流的质量改变时候
        logger.info('生产者质量发生改变 %o', score)
        peer.in(this.id, 'producerScore', {
          producerId: producer.id,
          score
        })
      })
      // 为其他客户端创建消费者
      let otherPeers = this._getOtherPeers({ excludeId: peer.id })
      for (const otherPeer of otherPeers) {
        // 创建消费者
        this.createConsumer({
          producer,
          producerPeer: peer,
          consumerPeer: otherPeer
        })
      }
      // 通知客户端生产者创建成功
      peer.emit('produce', SuccessEmit({
        data: {
          id: producer.id
        }
      }))
      // 如果为音频则监听音量检查器
      if (kind === 'audio') {
        this.audioLevelObserver.addProducer({ producerId: producer.id })
      }
    })

    // 关闭生产者
    peer.socket.on('closeProducer', async data => {
      const { producerId } = data
      const producer = peer.data.producers.get(producerId)
      if (!producer) {
        logger.error('关闭生产者时候发现生产者 %o 不存在', producerId)
        return peer.emit('closeProducer', FailEmit({ msg: '要关闭的生产者不存在' }))
      }
      await producer.close()
      peer.emit('closeProducer', SuccessEmit({}))
      // 移除生产者
      peer.data.producers.delete(producerId)
    })

    // 暂停生产者
    peer.socket.on('producerPause', async data => {
      const { producerId } = data
      const producer = peer.data.producers.get(producerId)
      if (!producer) {
        logger.error('暂停生产者时候发现生产者 %o 不存在', producerId)
        return peer.emit('producerPause', FailEmit({ msg: '暂停生产者时候发现生产者不存在' }))
      }
      await producer.pause()
      peer.emit('producerPause', SuccessEmit({}))
    })

    // 恢复生产者
    peer.socket.on('producerResume', async data => {
      const { producerId } = data
      const producer = peer.data.producers.get(producerId)
      if (!producer) {
        logger.error('恢复生产者时候发现生产者 %o 不存在', producerId)
        return peer.emit('producerResume', FailEmit({ msg: '恢复生产者时候发现生产者不存在' }))
      }
      await producer.resume()
      peer.emit('producerResume', SuccessEmit({}))
    })

    // 全体禁言
    peer.socket.on('pauseRoomAudio', async data => {
      const { id } = data
      if (id !== this.data.creater || this.allPaused) {
        logger.info('客户端 %o 发起全体禁言，但不是房主，指令无效', id)
        return peer.emit('pauseRoomAudio', FailEmit({ msg: '指令无效或房间已经禁言' }))
      }
      // 获取其他客户端
      const peers = this._getOtherPeers({ excludeId: this.data.creater })
      // 对其他客户端的进行禁言
      for (const p of peers) {
        const producers = p.data.producers.values()
        for (const producer of producers) {
          if (producer.kind === 'audio')
            producer.pause()
        }
      }
      // 修改状态
      this.allPaused = true
      // 通知房间所有客户端房间信息
      this.io.in(this.id).emit('roomPausedChange', { paused: true })
      // 通知房主禁言操作成功
      peer.emit('pauseRoomAudio', SuccessEmit({}))
    })

    // 全体解禁
    peer.socket.on('resumeRoomMic', async data => {
      const { id } = data
      if (id !== this.data.creater || !this.allPaused) {
        logger.info('客户端 %o 发起全体解禁，但不是房主，指令无效', id)
        return peer.emit('resumeRoomMic', FailEmit({ msg: '指令无效或房间已经全体解禁' }))
      }
      // 获取其他客户端
      const peers = this._getOtherPeers({ excludeId: this.data.creater })
      // 对其他客户端的进行禁言
      for (const p of peers) {
        const producers = p.data.producers.values()
        for (const producer of producers) {
          if (producer.kind === 'audio')
            producer.resume()
        }
      }
      // 修改状态
      this.allPaused = false
      // 通知房间所有客户端房间信息
      this.io.in(this.id).emit('roomPausedChange', { paused: false })
      // 通知房主解禁操作成功
      peer.emit('resumeRoomMic', SuccessEmit({}))
    })

    // 重新启动ice
    peer.socket.on('restartIce', async data => {
      const { transportId } = data
      const transport = peer.data.transports.get(transportId)
      if(!transport) {
        logger.error('重新启动ice时候发现通道 %o 不存在', transportId)
        return peer.emit('restartIce', FailEmit({ msg: '重新启动ice时候发现通道不存在' }))
      }
      const iceParameters = await transport.restartIce()
      peer.emit('restartIce', SuccessEmit({ data: iceParameters }))
    })

    // 监听连接关闭
    peer.socket.on('disconnect', async () => {
      // 判断客户端是否加入房间
      if (!peer.data.jioned)
        return
      logger.info('客户端 %o 离开了房间', peer.id)
      // 通知其他客户端
      this.io.in(this.id).emit('peerClosed', { id: peer.id })
      // 关闭客户端所有的通道
      for (const transport of peer.data.transports.values()) {
        transport.close()
      }

      // 移除客户端
      this.peers.delete(peer.id)
      const peers = Array.from(this.peers.values())

      // 判断房间人数
      if (peers.length <= 0)
        return this.close()

      // 判断移除客户端是否为房主
      if (this.data.creater === peer.id) {
        const newCreater = peers[0].id
        this._setRoomCreater(newCreater)
      }
    })
  }

  /**
   * 创建消费者
   * @param {*} param0 
   * - 
   * - producer       消费者对应的生产者
   * - producerPeer   生产者所在的客户端
   * - consumerPeer   消费者所在的客户端
   */
  async createConsumer({ producer, producerPeer, consumerPeer }) {
    const rtpCapabilities = consumerPeer.data.rtpCapabilities
    logger.info('createConsumer  produce %o', producer.id)
    // 判断该客户端的消费者是否能消费该生产者
    const format = this.router.canConsume({
      producerId: producer.id,
      rtpCapabilities
    })
    if (!format) {
      return logger.info('客户端 %o 无法消费 客户端 %o 生产的媒体', producerPeer.id, consumerPeer.id)
    }
    // 判断是否存在消费通道
    const transport = Array
      .from(consumerPeer.data.transports.values())
      .find(item => item.appData.consume)
    if (!transport) {
      return
    }
    // 创建消费者
    const consumer = await transport.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: true, // 暂停模式下启动
      appData: {
        peerId: consumerPeer.id
      }
    })
    // 为消费客户端添加消费者
    consumerPeer.data.consumers.set(consumer.id, consumer)
    // 监听函数
    consumer.on('transportclose', () => {
      logger.info('消费所在的轨道关闭了')
      consumerPeer.data.consumers.delete(consumer.id)
    })
    consumer.on('producerclose', () => {
      logger.info('消费者对应的生产者关闭了')
      consumerPeer.data.consumers.delete(consumer.id)
      this.io.in(this.id).emit('consumerProducerClosed', {
        id: consumer.id,
        peerId: consumer.appData.peerId
      })
    })
    consumer.on('score', score => {
      logger.info('消费者消费的流质量发生改变 %o', score)
      this.io.in(this.id).emit('consumerScore', {
        consumerId: consumer.id,
        score
      })
    })
    consumer.observer.on('pause', () => {
      logger.info('监听到事件：消费者或对应的生产者暂停')
      this.io.in(this.id).emit('consumerPause', {
        id: consumer.id
      })
    })
    consumer.observer.on('resume', () => {
      logger.info('监听到事件：消费者或对应的生产者恢复生产')
      this.io.in(this.id).emit('consumerResume', {
        id: consumer.id
      })
    })
    // 通知客户端有新的消费者
    consumerPeer.emit('newConsumer', {
      producerPeerId: producerPeer.id,
      id: consumer.id,
      producerId: consumer.producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      paused: producer.paused,
      type: consumer.type,
      appData: consumer.appData,
      score: consumer.score
    })
    // 启动消费者
    await consumer.resume()
  }

  /**
   * 设置房间的房主
   * @param {String} id  客户端id 
   */
  _setRoomCreater(id) {
    this.data.creater = id
    this.io.in(this.id).emit('roomCreater', { id })
  }

  /**
   * 获取其他客户端
   * @param {*} param0 
   * -
   * - excludeId    需要排除的peerId
   */
  _getOtherPeers({ excludeId = null }) {
    let ret = []
    for (const [key, peer] of this.peers) {
      if (key !== excludeId && peer.data.jioned) {
        ret.push(peer)
      }
    }
    return ret
  }

  /**
   * 过滤Peer扩展的属性
   * @param {*} param0 
   * -
   * - peer   客户端实例
   */
  _filterPeerExtendProperty({ peer }) {
    const { jioned, transports, producers, consumers, rtpCapabilities, sctpCapabilities, ...defaultData } = peer.data
    return {
      id: peer.id,
      data: defaultData || {}
    }
  }

  /**
   * 扩展房间内客户端属性
   * @param {*} param0 
   * -
   * - peer     Peer实例
   */
  _extendPeerData({ peer }) {
    // 是否加入房间
    peer.data.jioned = false
    // 客户端里的通道
    peer.data.transports = new Map()
    // 客户端里的生产者
    peer.data.producers = new Map()
    // 客户端里的消费者
    peer.data.consumers = new Map()
    // 客户端的rtp能力
    peer.data.rtpCapabilities = undefined
    // 客户端sctp能力
    peer.data.sctpCapabilities = undefined
  }

  /**
   * 处理房间音量检查测监听函数
   */
  _handleAudioLevelObserver() {
    // 监听有人说话
    this.audioLevelObserver.observer.on('volumes', async volumes => {
      const { producer, volume } = volumes[0]
      // logger.info('监听到房间内有生产者声音')
      this.io.sockets.in(this.id).emit('speaker', {
        id: producer.appData.peerId,
        volume
      })
    })
    // 监听没有声音
    this.audioLevelObserver.on('silence', () => {
      // 没有声音
      this.io.sockets.in(this.id).emit('speaker', {
        id: null,
        volume: null
      })
    })
  }
}

module.exports = Room
