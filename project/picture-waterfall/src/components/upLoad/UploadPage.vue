<template>
  <div class="container">
    <span>上传图片：</span>
    <UploadComp></UploadComp>
  </div>
</template>
<script>
import UploadComp from './components/UploadComp.vue'
export default {
  name: 'UpLoadPage',
  components: { UploadComp },
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  /* flex-wrap: wrap; */
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 500;
  span {
    flex-shrink: 0;
  }
}
</style>
