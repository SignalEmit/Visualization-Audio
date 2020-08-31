module.exports = {
  outputDir: './dist',
  publicPath: './',
  assetsDir: 'static',
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 9527,
    hot: true, // 热更新
    https: false,
    hotOnly: false,
    proxy: {     //这里最好有一个 /
      '/': {     //这里最好有一个 /
        target: 'http://127.0.0.1:12345',  // 后台接口域名
        ws: false,        //如果要代理 websockets，配置这个参数
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/': ''
        }
      }
    },
    before: app => { }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({ // 把px单位换算成rem单位
            rootValue: 136, // 换算的基数(设计图750的根字体为75)
            // selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
            propList: ['*']
          })
        ]
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  }
}