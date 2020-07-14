
const path = require('path');
const cdnConfig = require('./config/cdn')
const appConfig = require('./config/config')
const isDev = process.env.NODE_ENV === 'development'
const isProdNoCdn = process.env.VUE_APP_BUILD_ENV === 'prodNoCdn'

function resolve(dir) {
  //此处使用path.resolve 或path.join 可自行调整
  return path.join(__dirname, dir)
}
// 生产环境下配置
const build = isDev ? {} : {
  // 输出html名称
  indexPath: appConfig.indexPath,
  // 静态资源文件夹
  assetsDir: appConfig.assetsDir,
  // 静态资源路径
  publicPath: isProdNoCdn ? '/online' : cdnConfig.cdn.host,

  configureWebpack: { // webpack 配置
    output: {
      filename: `${appConfig.assetsDir}/js/[name].[chunkhash:20].js`,
      chunkFilename: `${appConfig.assetsDir}/js/[name].[chunkhash:20].js`
    },
    plugins: [
      // new CompressionPlugin({
      //   test: /\.js$|\.html$|\.css$/,
      //   threshold: 5120,
      //   deleteOriginalAssets: true // 删除原文件
      // })
    ]
  }
}

module.exports = {
  devServer: {
    // host: '127.0.0.1',
    port: '9011',
    // disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'https://localhost:4440',
        ws: true,//是否代理websockets
        changeOrigin: true,   // 设置同源  默认false，是否需要改变原始主机头为目标URL
        pathRewrite: {
          '^/api': '' // 需要rewrite重写的,
        }
      }
    }
  },

  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  //文件hash
  filenameHashing: true,

  // 生产环境的配置
  ...build,

  chainWebpack: config => {

    // console.log(config, 'webpack')
    config.resolve.alias
      // key,value自行定义，比如.set('@assets', resolve('src/assets'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
      .set('base', resolve('src/base'))
      .set('router', resolve('src/router'))
      .set('views', resolve('src/views'))
      .set('api', resolve('src/api'))
      .set('models', resolve('src/models'))

    // if (process.env.NODE_ENV === 'production') {
    //   return {
    //     plugins: [
    //       new CompressionPlugin({
    //         test: /\.js$|\.html$|.\css/, //匹配文件名
    //         threshold: 10240,//对超过10k的数据压缩
    //         deleteOriginalAssets: true //不删除源文件
    //       })
    //     ]
    //   }
    // }
  }
}
