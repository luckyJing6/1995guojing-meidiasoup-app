/*
 * @Author: 郭靖 
 * @Date: 2020-06-03 16:13:09 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-03 17:29:36
 */
const SET_OWNER = 'SET_OWNER'


export default {
  state: {
    owner: {
      id: '',
      name: '',
      headPhoto: '',
      consumers: [],
      produers: []
    }
  },
  mutations: {
    [SET_OWNER](state, peer) {
      state.owner.id = peer.id
      state.owner.name = peer.data.name
      state.owner.headPhoto = peer.data.headPhoto
    }
  },
  getters: {
    owner: state => state.owner
  },
  actions: {
    setOwner({ commit }, peer) {
      commit(SET_OWNER, peer)
    }
  }
}