/*
 * @Author: 郭靖 
 * @Date: 2020-05-28 16:52:09 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-05-28 17:11:34
 */
const { LinValidator, Rule } = require('../../core/lin-validator-v2')

class RoomValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isLength', '房间号必须为6为数', { min: 6, max: 6 })
    ]
  }
}

module.exports = {
  RoomValidator
}