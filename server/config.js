/*
 * @Author: 郭靖 
 * @Date: 2020-05-28 16:15:48 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-13 23:00:21
 */
const os = require('os')

const environment = process.env.environment
// https
const certKeyName = environment === 'dev' ? 'privkey' : '***'
const certPemName = environment === 'dev' ? 'fullchain' : '***'
// webrtcips
const webrtcIp = environment === 'dev' ? { ip: '127.0.0.1', announcedIp: false } : { ip: '*******', announcedIp: '*******' }


module.exports = {
  environment, // 环境
  https: {
    ip: '0.0.0.0',
    port: 4440,
    options: {
      key: `${process.cwd()}/certs/${certKeyName}.key`,
      cert: `${process.cwd()}/certs/${certPemName}.pem`
    }
  },
  mediasoup: {
    routerOptions: {
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters:
          {
            'x-google-start-bitrate': 1000
          }
        },
        {
          kind: 'video',
          mimeType: 'video/VP9',
          clockRate: 90000,
          parameters:
          {
            'profile-id': 2,
            'x-google-start-bitrate': 1000
          }
        },
        {
          kind: 'video',
          mimeType: 'video/h264',
          clockRate: 90000,
          parameters:
          {
            'packetization-mode': 1,
            'profile-level-id': '4d0032',
            'level-asymmetry-allowed': 1,
            'x-google-start-bitrate': 1000
          }
        },
        {
          kind: 'video',
          mimeType: 'video/h264',
          clockRate: 90000,
          parameters:
          {
            'packetization-mode': 1,
            'profile-level-id': '42e01f',
            'level-asymmetry-allowed': 1,
            'x-google-start-bitrate': 1000
          }
        }
      ]
    },
    workerSettings: {
      workerNumbers: os.cpus().length, // worker数量
      logLevel: 'warn', // 日志级别
      logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp', 'rtx', 'bwe', 'score', 'simulcast', 'svc',
        'sctp'], // 日志标记
      rtcMinPort: 40000, // 最小端口
      rtcMaxPort: 50000, // 最大端口
      appData: {
        author: '1995郭靖'
      }
    },
    // webrtc 地址
    webRtcTransportOptions: {
      listenIps: [webrtcIp],
      initialAvailableOutgoingBitrate: 1000000, // 可用传出比特率
      minimumAvailableOutgoingBitrate: 600000,
      maxSctpMessageSize: 262144, // DataProducer 发送的最大数据
      maxIncomingBitrate: 100000 // 最大传入比特率
    }
  }
}