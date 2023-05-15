// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
// })
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  //基本路径
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  //输出目录
  outputDir: 'dist',
  //指定生成的文件
  indexPath: 'index.html',
  //vue兼容ie
  transpileDependencies: true,
  //是否启用eslint验证
  lintOnSave: false,
  //开发环境配置
  devServer: {
    open: true, //是否自动弹出浏览器页面
    host: '0.0.0.0',
    port: '8080',
    https: false,
    proxy: {
      '/water_fall': {
        target: 'http://localhost:3000/', //接口的域名
        changeOrigin: true, //是否跨域
      },
    },
  },
})
