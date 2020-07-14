import Storage from 'good-storage'
const RERESH_DATA_OUT_TIME = 5000
const RERESH_DATA = '__RERESH_DATA__' // 页面刷新时候存储的数据
export default class Database {
  constructor() {
  }
  // 页面刷新时候存储的数据
  static setWindowRefreshData(data) {
    Storage.set(RERESH_DATA, data)
  }
  // 获取页面刷新时候存储的数据, 如果正式开发请加密数据
  static getWindowRefreshData() {
    const s = Storage.get(RERESH_DATA) || JSON.stringify({})
    return s
  }
  // 清空页面刷新时候存储的数据
  static clearWindowRefrshData() {
    const saveData = Database.getWindowRefreshData()
    const nowTime = new Date().getTime()
    if (saveData && saveData.time) {
      if (nowTime - saveData.time > RERESH_DATA_OUT_TIME) {
        Storage.remove(RERESH_DATA)
        console.log('清空页面刷新时候存储的数据')
      }
    }
  }
}