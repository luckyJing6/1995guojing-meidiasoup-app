/*
 * @Author: 郭靖 
 * @Date: 2020-05-22 10:45:59 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-11 09:46:20
 */
import faker from 'faker' // 自动创建人名库

/**
 * 
 * @param {*} val 判断参数
 * @param {Array} valList 判断数组
 */
export function oneOf(val, valList) {
  if (!Array.isArray(valList)) return false
  const index = valList.findIndex(item => item === val)
  if (index >= 0)
    return true
  else
    return false
}

/**
 * 随机中文名称
 */
export function randomName() {
  faker.locale = 'zh_CN'
  // console.log(`${faker.internet.userName()}`)
  // console.log(`${faker.internet.password(8)}`)
  return `${faker.name.firstName()}${faker.name.lastName()}`
}

/**
 * 将options转为对象
 * @param {Array} options 
 * -
 * - text   中文提示
 * - value  data中的key值
 */
export function options2data(options) {
  let ret = {}
  if (!Array.isArray(options))
    return ret

  for (const item of options) {
    ret[item.value] = item
  }
  return ret
}