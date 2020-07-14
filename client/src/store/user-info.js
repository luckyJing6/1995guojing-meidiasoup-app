export default {
  state: {
    userInfo: {
      userId: '', // 用户id
      userName: '', // 用户名称
      headPhoto: '' // 头像
    }
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo.userId = userInfo.userId
      state.userInfo.userName = userInfo.userName
      state.userInfo.headPhoto = userInfo.headPhoto || ''
    }
  },
  getters: {
    userInfo: state => state.userInfo
  }
}