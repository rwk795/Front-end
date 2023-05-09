<template>
  <div id="app">
    <WaterFall />
  </div>
</template>

<script>
import WaterFall from './components/WaterFall'
export default {
  name: 'App',
  components: {
    WaterFall,
  },
  // data: () => ({
  //   picList: [],
  // }),
  // mounted() {
  //   this.$axios({
  //     method: 'get',
  //     url: '/api/getPicList', // 接口地址
  //     data: {},
  //   }).then(({ picList }) => {
  //     this.picList = picList
  //   })
  // },
}
</script>

<!-- <style scoped>
</style> -->
