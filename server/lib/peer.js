/*
 * @Author: 郭靖 
 * @Date: 2020-06-01 09:33:53 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-05 15:06:58
 */
const Logger = require('./logger')

const logger = new Logger('peer')

class Peer {
  /**
   * 
   * @param {Object} param0 
   * -
   * - id       客户端id
   * - socket   客户端所在socket
   * - data     客户端扩展数据（如名称，头像等）
   */
  constructor({ id, socket, data = {} }) {
    this.id = id
    this.socket = socket
    this.data = data
  }

  /**
   * 发送数据
   * @param {String} cmd 指令
   * @param {*} data 
   */
  emit(cmd, data) {
    if (!this.socket) {
      return logger.error('客户端: %o 未绑定socket', this.id)
    }
    this.socket.emit(cmd, data)
  }


  /**
   * 向peer所在房间内的其他客户端发送信息
   * @param {String} room 
   * @param {String} cmd 
   * @param {Object} data 
   */
  to(room, cmd, data) {
    if (!this.socket) {
      return logger.error('客户端: %o 未绑定socket', this.id)
    }
    this.socket.to(room).emit(cmd, data)
  }

  /**
   * 向peer所在房间所有客户端发送信息
   * @param {String} room 
   * @param {String} cmd 
   * @param {Object} data 
   */
  in(room, cmd, data) {
    if (!this.socket) {
      return logger.error('客户端: %o 未绑定socket', this.id)
    }
    this.socket.in(room).emit(cmd, data)
  }
}

module.exports = Peer