import axios from 'axios'
import Qs from 'qs' // 用来处理参数，可不使用，若要使用，npm安装： npm install qs
// 添加一个请求拦截器
axios.interceptors.request.use(
  (config) => {
    console.log(config, '----')
    config.data = Qs.stringify(config.data)
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
//添加一个响应拦截器
axios.interceptors.response.use(
  (res) => {
    //在这里对返回的数据进行处理
    console.log(res.data, '网络正常')
    return res.data
  },
  (err) => {
    console.log('网络开了小差！请重试...')
    return Promise.reject(err)
  }
)

export default axios
