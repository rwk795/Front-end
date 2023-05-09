<template>
  <div
    @touchstart="touchStartHandle"
    @touchmove="touchMoveHandle"
    @touchend="touchEnd"
  >
    <div ref="refreshLogin">
      <Loading v-if="isShow.isRefresh" location="center" />
      <slot></slot>
      <Loading v-if="isShow.isLoading" location="center" />
    </div>
  </div>
</template>
<script>
import Loading from './Loading.vue'
export default {
  name: 'ReFlash',
  components: {
    Loading,
  },
  data: function () {
    return {
      refreshLoginStatus: 'normal', //组件当前状态：正常浏览模式normal，上拉刷新模式refresh，下拉加载模式loading
      isShow: {
        //加载动画控制开关
        isRefresh: false,
        isLoading: false,
      },
      startPos: {
        //手指初始按压位置
        pageY: 0,
      },
      dis: {
        //手移动距离
        pageY: 0,
      },
    }
  },
  methods: {
    touchStartHandle(e) {
      //记录起始位置 和 组件距离window顶部的高度
      this.startPos.pageY = e.touches[0].pageY
      if (window.scrollY <= 0) {
        this.refreshLoginStatus = 'refresh'
      } else {
        console.log('refreshLoginStatus')
        this.refreshLoginStatus = 'loading'
      }
    },
    touchMoveHandle(e) {
      if (this.isShow.isRefresh) return
      let dis = e.touches[0].pageY - this.startPos.pageY
      if (this.refreshLoginStatus === 'refresh') {
        if (dis <= 0) return
        this.isShow.isRefresh = true
        this.$refs.refreshLogin.style.transform = `translateY(${
          dis < 100 ? dis : 100
        }px)`
      } else {
        if (dis >= 0) return
        this.isShow.isLoading = true
        // this.$refs.refreshLogin.style.transform = `translateY(${
        //   dis < 100 ? dis : 100
        // }px)`
      }
      // if (this.refreshLoginStatus === 'refresh' && dis > 0) {
      //   //下拉刷新成立条件
      //   this.isShow.isRefresh = true
      //   //下拉到一定距离后，内容页不随touchmove移动
      //   this.$refs.refreshLogin.style.transform = `translateY(${
      //     dis < 100 ? dis : 100
      //   }px)`
      // }
    },
    async touchEnd(e) {
      if (!this.isShow.isRefresh && !this.isShow.isLoading) return
      if (this.isShow.isRefresh) {
        //异步加载数据
        await this.$emit('refreshEmit')
        //松手后加载动画消失，并且内容页回到原位置
        this.isShow.isRefresh = false
        this.$refs.refreshLogin.style.transform = `translateY(0px)`
        this.refreshLoginStatus = 'normal'
      } else {
        console.log('this.$emit()')
        await this.$emit('loadMoreEmit')
        //松手后加载动画消失，并且内容页回到原位置
        this.isShow.isLoading = false
        // this.$refs.refreshLogin.style.transform = `translateY(0px)`
        this.refreshLoginStatus = 'normal'
      }
    },
  },
}
</script>
