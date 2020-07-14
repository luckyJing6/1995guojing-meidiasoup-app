/*
 * @Author: 郭靖
 * @Date: 2020-05-28 15:45:17
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-15 21:18:58
 */
const TIME_OUT = 60000
export default class SocketPromise {
  constructor() {
  }

  /**
   * websocket 一发一收
   * @param {*} param0 
   * -
   * - socket   socket.io的实例
   * - cmd      指令字符串
   * - data     携带参数
   */
  static async once({ socket, cmd, data }) {
    let timer = null
    return new Promise((resolve, reject) => {
      socket.emit(cmd, data)
      socket.once(cmd, req => {
        if (req.code === 0) {
          resolve(req.data)
        } else {
          reject(req.msg)
        }
        clearTimeout(timer)
      })
      // 处理超时
      timer = setTimeout(() => {
        reject(`指令 ${cmd} 请求超时`)
      }, TIME_OUT)
    })
  }
}