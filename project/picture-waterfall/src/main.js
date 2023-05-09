import Vue from 'vue'
import App from './App.vue'
import axios from './axios'
const animated = require('animate.css')
// import animated from 'animate.css'
require('./mock')
Vue.use(animated)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
new Vue({
  render: (h) => h(App),
}).$mount('#app')
