/*
 * @Author: 郭靖 
 * @Date: 2020-06-03 17:29:33 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-12 12:33:02
 */
const SET_ROOM_INFO = 'SET_ROOM_INFO'
const SET_SPEAKER = 'SET_SPEAKER'
const SET_PAUSED = 'SET_PAUSED'
const CLEAR_ROOM_INFO = 'CLEAR_ROOM_INFO'
const SET_ROOM_CREATER = 'SET_ROOM_CREATER'
const SET_ROOM_MUTED = 'SET_ROOM_MUTED'

export default {
  state: {
    roomInfo: {
      id: '',
      creater: '',
      speakerId: '',
      speakerVolume: 0,
      paused: false,
      muted: false
    }
  },
  mutations: {
    [SET_ROOM_INFO](state, roomInfo) {
      state.roomInfo.id = roomInfo.id
      state.roomInfo.creater = roomInfo.creater
      state.roomInfo.paused = roomInfo.paused
    },
    [SET_ROOM_CREATER](state, id) {
      state.roomInfo.creater = id
    },
    [SET_SPEAKER](state, data) {
      state.roomInfo.speakerId = data.id
      state.roomInfo.speakerVolume = data.volume
    },
    [SET_PAUSED](state, bool) {
      state.roomInfo.paused = bool
    },
    [SET_ROOM_MUTED](state, bool) {
      state.roomInfo.muted = bool
    },
    [CLEAR_ROOM_INFO](state) {
      state.roomInfo = {
        id: '',
        creater: '',
        speakerId: '',
        speakerVolume: 0,
        paused: false,
        muted: false
      }
    }
  },
  getters: {
    roomInfo: state => state.roomInfo
  },
  actions: {
    setRoomInfo({ commit }, roomInfo) {
      commit(SET_ROOM_INFO, roomInfo)
    },
    setSpeaker({ commit }, data) {
      commit(SET_SPEAKER, data)
    },
    // 静音
    setRoomMuted({ commit }, data) {
      commit(SET_ROOM_MUTED, data)
    },
    // 暂停传输麦克风流
    setRoomPaused({ commit }, data) {
      commit(SET_PAUSED, data)
    },
    setRoomCreater({ commit }, id) {
      commit(SET_ROOM_CREATER, id)
    },
    clear({ commit }) {
      commit(CLEAR_ROOM_INFO)
    }
  }
}