/*
 * @Author: 郭靖 
 * @Date: 2020-06-07 15:19:50 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-07 15:29:02
 */
export default class EventEmitter {
  constructor() {
    this.events = new Map()
  }
  /**
   * 监听事件
   * @param {String} cmd 事件指令
   * @param {Function} cb 回调函数
   */
  on(cmd, cb) {
    const cbList = this.events.get(cmd)
    if (!cbList) {
      this.events.set(cmd, [])
    }
    this.events.get(cmd).push(cb)
  }

  /**
   * 触发事件
   * @param {String} cmd 事件指令
   * @param {Object} data 传递参数
   */
  emit(cmd, data) {
    const cbList = this.events.get(cmd)
    if (cbList) {
      for (const cb of cbList) {
        cb && cb(data)
      }
    }
  }

  /**
   * 触发事件，并获取回调
   * @param {String} cmd 事件指令
   * @param {Object} data 传递参数
   * 
   * @returns async
   */
  promiseEmit(cmd, data) {
    return new Promise(resolve => {
      this.emit(cmd, data)
      resolve()
    })
  }

} 