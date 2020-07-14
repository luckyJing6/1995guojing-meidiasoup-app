/*
 * @Author: 郭靖 
 * @Date: 2020-06-02 17:12:01 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-15 15:28:35
 */

// 创建OtherPeer类的目的为了让其他人知道OhterPeer中存在哪些属性
class OtherPeer {
  constructor(options) {
    this.id = options.id
    this.name = options.name
    this.headPhoto = options.headPhoto
    this.isCreater = options.isCreater
    this.muted = false
    this.consumers = []
  }
  static create(peer) {
    return new OtherPeer({
      id: peer.id,
      ...peer.data
    })
  }
}

const ADD_PEERS = 'ADD_PEERS'
const ADD_ONE_PEER = 'ADD_ONE_PEER'
const DELETE_PEER = 'DELETE_PEER'
const ADD_PEER_CONSUMER = 'ADD_PEER_CONSUMER'
const DELETE_PEER_CONSUMER = 'DELETE_PEER_CONSUMER'
const SET_PEER_MUTED = 'SET_PEER_MUTED'
const CLEAR_PEERS = 'CLEAR_PEERS'

export default {
  state: {
    otherPeers: {}
  },
  mutations: {
    // 批量添加其他客户端
    [ADD_PEERS](state, otherPeers) {
      if (!Array.isArray(otherPeers))
        throw new Error('批量添加其他客户端参数必须为数组')
      let peers = {}
      for (const peer of otherPeers) {
        peers[peer.id] = OtherPeer.create(peer)
      }
      state.otherPeers = { ...state.otherPeers, ...peers }
    },
    // 单个添加客户端
    [ADD_ONE_PEER](state, peer) {
      state.otherPeers = {
        ...state.otherPeers,
        [peer.id]: OtherPeer.create(peer)
      }
    },
    // 移除客户端
    [DELETE_PEER](state, peer) {
      const p = state.otherPeers[peer.id]
      if (p) {
        delete state.otherPeers[peer.id]
        state.otherPeers = { ...state.otherPeers }
      }
    },
    [ADD_PEER_CONSUMER](state, data) {
      const p = state.otherPeers[data.producerPeerId]
      if (p) {
        p.consumers.push(data.id)
      }
    },
    [DELETE_PEER_CONSUMER](state, data) {
      const p = state.otherPeers[data.peerId]
      if (p) {
        // 移除消费者id
        const fIndex = p.consumers.findIndex(item => item === data.id)
        if (fIndex > -1)
          p.consumers.splice(fIndex)
      }
    },
    [SET_PEER_MUTED](state, data) {
      const p = state.otherPeers[data.peerId]
      if (p) {
        p.muted = data.muted
        state.otherPeers = { ...state.otherPeers, [p.id]: p }
      }
    },
    [CLEAR_PEERS](state) {
      state.otherPeers = {}
    }
  },
  getters: {
    otherPeers: state => state.otherPeers
  },
  actions: {
    addPeers({ commit }, peers) {
      commit(ADD_PEERS, peers)
    },
    addOnePeer({ commit }, peer) {
      commit(ADD_ONE_PEER, peer)
    },
    deletePeer({ commit }, peers) {
      commit(DELETE_PEER, peers)
    },
    addConsumer({ commit }, data) {
      console.log('peer add consumer', data)
      commit(ADD_PEER_CONSUMER, data)
    },
    deleteConsumer({ commit }, data) {
      commit(DELETE_PEER_CONSUMER, data)
    },
    setPeerMuted({ commit }, data) {
      commit(SET_PEER_MUTED, data)
    },
    clear({ commit }) {
      commit(CLEAR_PEERS)
    }
  }
}