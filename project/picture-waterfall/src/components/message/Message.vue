//封装的message组件
<template>
  <div v-if="showTips" class="tips_box_common">
    {{ errorMessage }}
  </div>
</template>

<script>
export default {
  name: 'MessageInfo',
  props: {
    showTips: Boolean,
    errorMessage: {
      type: String,
      default: '',
    },
  },
  data: () => {},
}
</script>

<style scoped>
.tips_box_common {
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background: rgba(0, 0, 0, 1);
  opacity: 0.8;
  padding: 0px 18px;
  display: inline-block;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  border-radius: 5px;
  width: -webkit-max-content;
  width: -moz-max-content;
  width: max-content;
  height: 50px;
  line-height: 50px;
}
</style>
