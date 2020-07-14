import axios from 'axios'
// import DataBase from 'models/db'
axios.interceptors.request.use(
  config => {
    // config.headers['token'] = DataBase.getToken()
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 请求最长等待时间
axios.defaults.timeout = 60000
axios.interceptors.response.use(
  function (res) {
    // 在这里对返回的数据进行处理
    return res
  },
  err => {
    return Promise.reject(err)
  }
)

