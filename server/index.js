/*
 * @Author: 郭靖 
 * @Date: 2020-05-28 16:17:59 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-13 22:59:38
 */
const Koa = require('koa')
const koaStatic = require('koa-static')
const bodyparser = require('koa-bodyparser')
const path = require('path')
const fs = require('fs')
const https = require('https')
const Mediasoup = require('mediasoup')
const SocketIO = require('socket.io')
const { AwaitQueue } = require('awaitqueue')

const Room = require('./lib/room')
const Loger = require('./lib/logger')
const config = require('./config')
const exception = require('./middleware/exception')
const { InitManager } = require('./core/init')
const { SuccessEmit, FailEmit } = require('./lib/helper')


// loger
const loger = new Loger()

// 队列
const queue = new AwaitQueue()

// Koa实例
let app = null

// httpsServer
let httpsServer = null

// rooms
const rooms = new Map()

// mediasoup workers
const mediasoupWorkers = []

// worker index
let workerIndex = 0


async function run() {
  // 启动mediasoupworker
  await runMediasoupWorker()
  // 创建koa
  await createKoaApp()
  // 启动https服务
  await runHttpsServer()
  // 启动wss服务
  await runSocketIoServer()
}

run()

// 启动mediasoup worket
async function runMediasoupWorker() {
  const { workerNumbers, ...options } = config.mediasoup.workerSettings
  for (let i = 0; i < workerNumbers; i++) {
    // 创建worker
    const worker = await Mediasoup.createWorker(options)
    // 添加到全局的mediasoupWorkers中
    mediasoupWorkers.push(worker)
    // 监听事件
    worker.on('died', error => {
      loger.error('mediasoup worker: %o 意外崩溃: %o', worker.pid, error)
    })
    worker.observer.on('close', () => {
      loger.info('mediasoup worker: %o 关闭了', worker.pid)
    })
  }
}

// 创建koa web服务
async function createKoaApp() {
  app = new Koa()
  // 静态文件
  app.use(koaStatic(path.join(__dirname, './static')))
  // 使用全局异常处理中间件
  app.use(exception)
  // 使用bodyparser
  app.use(bodyparser())
  // 初始化核心模块
  InitManager.init(app)
}

// 启动https服务
async function runHttpsServer() {
  const { ip, port, options } = config.https
  const tls = {
    key: fs.readFileSync(options.key),
    cert: fs.readFileSync(options.cert)
  }
  // https server
  httpsServer = https.createServer(tls, app.callback())
  // 监听端口
  await new Promise(resolve => {
    httpsServer.listen(port, ip, resolve)
  })
  loger.info(`https监听的ip: %o，端口: %o`, ip, port)
}

// 启动io
async function runSocketIoServer() {
  // 创建并绑定
  const io = new SocketIO()
  io.attach(httpsServer)
  // 监听连接
  io.on('connection', socket => {
    loger.info('客户端: %o 连接进来啦', socket.id)
    socket.on('disconnect', err => {
      console.log('客户端: %o 断开连接啦', socket.id)
    })
    socket.on('error', err => {
      console.log('客户端: %o  出现错误', err)
    })
    // 监听创建房间
    socket.on('createRoom', ({ id, data, h264, vp9, peerId, peerData }) => {
      queue.push(async () => {
        const r = await createRoom({ id, data, h264, vp9, peerId, io })
        if (!r) {
          return socket.emit('createRoom', FailEmit({ msg: '房间已经存在' }))
        }
        socket.emit('createRoom', SuccessEmit({}))
      })
    })
    // 与房间进行连接
    socket.on('connectionRoom', ({ peerId, roomId, peerData }) => {
      const room = rooms.get(roomId)
      if (!room) {
        socket.emit('connectionRoom', FailEmit({ msg: '房间不存在' }))
        return loger.error('客户端 %o 与房间 %o 进行连接失败，房间不存在', peerId, roomId)
      }
      room.handlePeerConnection({ peerId, socket, peerData })
    })
  })
}

// 获取下一个worker
function getNextMediasoupWorker() {
  const worker = mediasoupWorkers[workerIndex]
  if (++workerIndex >= mediasoupWorkers.length)
    workerIndex = 0

  return worker || mediasoupWorkers[0]
}

async function createRoom({ id, data, h264, vp9, peerId, io }) {
  let room = rooms.get(id)
  if (room) {
    loger.error('用户 %o 创建的房间 %o 失败，房间已经存在', peerId, id)
    return false
  }
  const worker = getNextMediasoupWorker()
  room = await Room.create({
    id,
    worker,
    io,
    h264,
    vp9,
    data: {
      ...data,
      creater: peerId
    }
  })
  rooms.set(id, room)
  loger.info('用户 %o 创建的房间 %o 成功', peerId, id)
  room.on('close', () => {
    const c = rooms.get(room.id)
    if (c) {
      rooms.delete(c.id)
    }
  })
  return room
}