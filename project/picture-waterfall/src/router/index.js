import Vue from 'vue'
const Router = require('vue-router')
Vue.use(Router)
const routes = [
  {
    path: '/uploadpage',
    component: () => import('../components/upLoad/UploadPage.vue'),
  },
  {
    path: '/index',
    component: () => import('../components/WaterFall.vue'),
  },
  {
    path: '/',
    component: () => import('../components/WaterFall.vue'),
  },
]

export default new Router({
  mode: 'history',
  routes,
})
