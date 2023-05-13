import Vue from 'vue'
import loadingComponent from './Message.vue'

const LoadingConstructor = Vue.extend(loadingComponent)

const instance = new LoadingConstructor({
  el: document.createElement('div'),
})

instance.show = false // 默认隐藏
const message = {
  show(message) {
    // 显示方法
    instance.showTips = true
    instance.errorMessage = message
    document.body.appendChild(instance.$el)
    setTimeout(function () {
      instance.showTips = false
    }, 1500)
  },
}

export default {
  install() {
    if (!Vue.$message) {
      Vue.$message = message
    }
    Vue.mixin({
      created() {
        this.$message = Vue.$message
      },
    })
  },
}
