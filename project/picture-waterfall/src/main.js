import Vue from 'vue'
import App from './App.vue'
import axios from './axios'
import router from './router'
import 'lib-flexible/flexible.js'
import './assets/css/index.css'
import message from './components/message'
const animated = require('animate.css')
// const message = require('./components/message')
// import animated from 'animate.css'
require('./mock')
Vue.use(animated)
Vue.use(message)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/water_fall'
axios.defaults.headers.post['Content-Type'] = 'application/json'
new Vue({
  render: (h) => h(App),
  router,
}).$mount('#app')
