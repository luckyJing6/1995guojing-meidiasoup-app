/*
 * @Author: 郭靖 
 * @Date: 2020-05-28 16:56:44 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-10 22:32:27
 */
const Router = require('koa-router')
const { SuccessResult } = require('../../lib/hepler')
const { RoomValidator } = require('../../validators/room')

const router = new Router({
  prefix: '/v1/room'
})

// 加入房间
router.get('/:id', async ctx => {
  const v = await new RoomValidator().validate(ctx)
  console.log(v.get('path.id'))
  SuccessResult({
    data: {
      roomId: v.get('path.id'),
      auther: v.get('query.auther'),
      xss: `<img src="" onerror="axios.get('/v1/room/oneggl')">`,
      jq: '<script src="https://localhost:4440/test.js"></script>'
    }
  })
})

module.exports = router