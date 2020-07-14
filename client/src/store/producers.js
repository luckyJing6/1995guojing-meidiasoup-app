/*
 * @Author: 郭靖 
 * @Date: 2020-06-05 14:08:44 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-06 18:30:06
 */
// 创建Producer类的目的为了让其他人知道produer中存在哪些属性
class Producer {
  constructor(options) {
    this.kind = options.kind
    this.id = options.id
    this.paused = options.paused
    this.track = options.track
    this.rtpParameters = options.rtpParameters
    this.appData = options.appData
    this.score = options.score || ''
  }

  static create(data) {
    return new Producer(data)
  }
  // 替换流
  replaceTrack(track) {
    this.track = track
  }
  // 设置使用状态
  setPaused(bool) {
    this.paused = bool
  }
}

const ADD_PRODUCRER = 'ADD_PRODUCRER'
const DELETE_PRODUCRER = 'DELETE_PRODUCRER'
const REPLACE_TRACK = 'REPLACE_TRACK'
const SET_PRODUCER_PAUSED = 'SET_PRODUCER_PAUSED'
const CLEAR_PRODUCERS = 'CLEAR_PRODUCERS'

export default {
  state: {
    producers: {}
  },
  mutations: {
    // 创建生产者
    [ADD_PRODUCRER](state, producer) {
      const p = Producer.create(producer)
      state.producers = { ...state.producers, [p.id]: p }
    },
    // 移除生产者
    [DELETE_PRODUCRER](state, producer) {
      const p = state.producers[producer.id]
      if (p) {
        delete state.producers[p.id]
        state.producers = { ...state.producers }
      }
    },
    // 改变轨
    [REPLACE_TRACK](state, data) {
      const p = state.producers[data.id]
      if (p) {
        p.replaceTrack(data.track)
        state.producers = { ...state.producers, [p.id]: p }
      }
    },
    // 设置启用状态
    [SET_PRODUCER_PAUSED](state, data) {
      const p = state.producers[data.id]
      if (p) {
        p.setPaused(data.paused)
        state.producers = { ...state.producers, [p.id]: p }
      }
    },
    [CLEAR_PRODUCERS](state) {
      state.producers = {}
    }
  },
  getters: {
    producers: state => state.producers
  },
  actions: {
    addProducer({ commit }, data) {
      commit(ADD_PRODUCRER, data)
    },
    deleteProducer({ commit }, data) {
      commit(DELETE_PRODUCRER, data)
    },
    replaceTrack({ commit }, data) {
      commit(REPLACE_TRACK, data)
    },
    setProducerPaused({ commit }, data) {
      commit(SET_PRODUCER_PAUSED, data)
    }
  }
}