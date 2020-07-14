/*
 * @Author: 郭靖 
 * @Date: 2020-06-10 18:47:48 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-11 19:08:11
 */
import Vue from 'vue'
import Main from './index.vue'

// id前缀
const prefixId = 'ggl-modal'
// id索引
let idIndex = 1
// 实例
let instence = null
// 实例数组
const instences = []
// 构造器
const ModalConstructor = Vue.extend(Main)


function Modal(options = {}) {
  // 设置id
  const id = `${prefixId}-${idIndex++}`
  // 配置options
  if (typeof options === 'string')
    throw new Error('options 必须为object')

  const { onOkTap, onCancelTap, onClose, ...ops } = options

  const data = { onOkTap, onCancelTap, onClose }
  // 处理用户监听方法
  handlUserFunc(id, data)
  // 创建实例
  instence = new ModalConstructor({
    propsData: ops,
    data
  })
  instence.id = id
  instence.$mount()
  document.body.appendChild(instence.$el)
  // 显示
  instence.visible = true
  // 加入数组
  instences.push(instence)
}

/**
 * 处理options
 * @param { String } id  组件id 
 * @param { Object } data 用户传递方法
 */
function handlUserFunc(id, data) {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const userFunc = data[key]
      data[key] = function () {
        Modal[key](id, userFunc)
      }
    }
  }
}

// 确定与取消回调
Modal.onCancelTap = Modal.onOkTap = function (id, userFunc) {
  // 在instences移除当前实例
  for (let i = 0; i < instences.length; i++) {
    const vm = instences[i]
    if (vm.id === id) {
      if (typeof userFunc === 'function')
        userFunc(vm, vm.value)
      break
    }
  }
}
// 关闭
Modal.onClose = function (id, userFunc) {
  for (let i = 0; i < instences.length; i++) {
    const vm = instences[i]
    if (vm.id === id) {
      if (typeof userFunc === 'function')
        userFunc(vm)
      vm.remove()
      instences.splice(i, 1)
      break
    }
  }
}

Modal.__$key = '$Modal'

export default Modal