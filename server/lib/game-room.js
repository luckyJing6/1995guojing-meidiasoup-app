/*
 * @Author: 郭靖 
 * @Date: 2020-06-01 10:40:15 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-01 11:01:23
 */
const Room = require('./room')

class GameRoom extends Room {
  constructor({ id, router, audioLevelObserver, io, data = {} }) {
    super({ id, router, audioLevelObserver, io, data })
  }

  /**
  * 创建GameRoom方法
  * @param {*} param0 
  * -
  * - id         房间id
  * - worker     mediasoupWorker实例
  * - io         socket.io
  * - h264       是否h264编码
  * - vp9        是否vp9编码，优先级比h264高
  * - data       房间其他参数
  * - peerNumber 房间人数4/6
  */
  static async create({ id, worker, io, h264 = false, vp9 = false, data = {}, peerNumber }) {
    const roomOptions = await GameRoom._initMediasoupRouter({ id, worker, h264, vp9 })
    return new GameRoom({ ...roomOptions, io, data, peerNumber })
  }
}

module.exports = GameRoom