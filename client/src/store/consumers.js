/*
 * @Author: 郭靖 
 * @Date: 2020-06-05 14:27:27 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-06 18:28:20
 */
class Consumer {
  constructor(options) {
    this.kind = options.kind
    this.type = options.type
    this.id = options.id
    this.paused = options.paused
    this.track = options.track
    this.rtpParameters = options.rtpParameters
    this.appData = options.appData
    this.producerId = options.producerId
    this.producerPeerId = options.producerPeerId
    this.score = options.score
  }
  static create(data) {
    return new Consumer(data)
  }

  // 设置使用状态
  setPaused(bool) {
    this.paused = bool
  }
}

const ADD_CONSUMER = 'ADD_CONSUMER'
const DELETE_CONSUMER = 'DELETE_CONSUMER'
const SET_PAUSED = 'SET_CONSUMER_PAUSED'
const CLEAR_CONUMERS = 'CLEAR_CONUMERS'
export default {
  state: {
    consumers: {}
  },
  mutations: {
    [ADD_CONSUMER](state, consumer) {
      const c = Consumer.create(consumer)
      state.consumers = { ...state.consumers, [c.id]: c }
    },
    [DELETE_CONSUMER](state, consumer) {
      const c = state.consumers[consumer.id]
      if (c) {
        delete state.consumers[c.id]
        state.consumers = { ...state.consumers }
      }
    },
    [SET_PAUSED](state, data) {
      const c = state.consumers[data.id]
      if (c) {
        c.setPaused(data.paused)
        state.consumers = { ...state.consumers, [c.id]: c }
      }
    },
    [CLEAR_CONUMERS](state) {
      state.consumers = {}
    }
  },
  getters: {
    consumers: state => state.consumers
  },
  actions: {
    addConsumer({ commit }, data) {
      commit(ADD_CONSUMER, data)
    },
    deleteConsumer({ commit }, data) {
      commit(DELETE_CONSUMER, data)
    },
    setConsumerPaused({ commit }, data) {
      commit(SET_PAUSED, data)
    },
    clear({ commit }) {
      commit(CLEAR_CONUMERS)
    }
  }
}