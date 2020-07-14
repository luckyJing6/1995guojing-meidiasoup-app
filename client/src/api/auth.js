/*
 * @Author: 郭靖 
 * @Date: 2020-07-10 21:12:24 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-10 21:16:00
 */
import axios from 'axios'
import { ip } from './config'

/**
 * 测试接口
 * @param {String} roomId 
 */
export function apiTest(roomId) {
  const url = ip + `/room/${roomId}`
  return axios.get(url)
}