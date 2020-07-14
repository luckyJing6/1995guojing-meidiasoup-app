/*
 * @Author: 郭靖 
 * @Date: 2020-06-08 17:10:09 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-10 20:23:19
 */
import Vue from 'vue'
import Main from './main'

// ID 前缀
const prefixId = 'ggl-Message'
// id
let idIndex = 1
// 每个message的间隔
const marginTop = 16
// 已经创建的实例
const instences = []
// 当前实例
let instence = null

// 创建构造器
const MessageConstructor = Vue.extend(Main)


function Message(options = {}) {
  // 设置id
  const id = `${prefixId}-${idIndex++}`
  // 判断并设置options类型
  if (typeof options === 'string')
    options = { text: options }

  // 保存用户存入的onClose方法
  const userOnClose = options.onClose
  // 设置当前onClose
  options.onClose = function () {
    Message.close(id, userOnClose)
  }
  // 创建实例
  instence = new MessageConstructor({
    data: options
  })
  // 设置id
  instence.id = id
  // 挂载
  instence.$mount()
  // append到body
  document.body.appendChild(instence.$el)
  // 设置实例的当前top
  let offsetTop = 20
  instences.forEach(vm => {
    const offsetHeight = vm.$el.offsetHeight
    offsetTop += offsetHeight + marginTop
  })
  instence.offsetTop = offsetTop
  // 显示并加入到数组中
  instence.visible = true
  instences.push(instence)
}

// 扩展type，快捷输入
const types = ['info', 'success', 'warning', 'error']
types.forEach(type => {
  Message[type] = (options = {}) => {
    if (typeof options === 'string')
      options = { text: options }
    options.type = type
    options.icon = type
    return new Message(options)
  }
})

// 关闭
Message.close = function (id, userOnClose) {
  let index = 0
  let height = marginTop
  // 在instences移除当前实例
  for (let i = 0; i < instences.length; i++) {
    const vm = instences[i]
    if (vm.id === id) {
      index = i
      height += vm.$el.offsetHeight
      if(typeof userOnClose === 'function')
        userOnClose()
      instences.splice(i, 1)
      break
    }
  }
  // 设置当前实例后面的位置
  for (let i = index; i < instences.length; i++) {
    const vm = instences[i]
    // 更新offset属性即可
    vm.offsetTop -= height
  }
}

// 关闭所有
Message.closeAll = () => {
  for (let i = instences.length - 1; i >= 0; i--) {
    instences[i].close()
  }
}

Message.__$key = '$Message'

export default Message