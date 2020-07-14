/*
 * @Author: 郭靖 
 * @Date: 2020-06-01 11:10:14 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-13 22:58:36
 */

import SocketClient from 'socket.io-client'
import SocketPromise from './socket-promise'

const BUILD_ENV = process.env.VUE_APP_BUILD_ENV

const SOCKET_URL = BUILD_ENV === 'development' ? 'wss://localhost:4440' : '**线上wss地址**'

export default class Peer {
  constructor({ id, socket, data }) {
    this.id = id
    this.socket = socket
    this.data = data
  }
  /**
   * 创建peer
   * @param {*} param0 
   * - 
   * - id      客户端id
   * - data    客户端其他参数如(名称，头像地址等)
   */
  static async create({ id, data }) {
    const socket = SocketClient(`${SOCKET_URL}`)
    // 监听函数
    socket.on('error', err => {
      console.log('客户端socket监听到error事件', err)
    })
    socket.on('disconnect', reason => {
      console.log('客户端socket监听到disconnect', reason)
    })
    return new Peer({ id, data, socket })
  }

  /**
   * 单次收发信息
   * @param {*} param0 
   * -
   * - cmd      指令
   * - data     携带参数
   */
  async once({ cmd, data }) {
    const r = await SocketPromise.once({
      socket: this.socket,
      cmd,
      data
    })
    return r
  }

  /**
   * 关闭连接
   */
  close() {
    this.socket.close()
  }
}