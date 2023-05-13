<template>
  <div :class="['container', location]">
    <div class="box" />
  </div>
</template>
<script>
export default {
  name: 'LoadingComp',
  props: {
    location: {
      type: String,
      default: 'center',
    },
  },
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  .box {
    position: relative;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 10px solid #ccc;
    border-right-color: transparent;
    animation: loadingAnimation 0.75s infinite;
  }
  @keyframes loadingAnimation {
    100% {
      transform: rotate(360deg);
    }
  }
}
.left {
  justify-content: flex-start;
}
.center {
  justify-content: center;
}
.right {
  justify-content: flex-end;
}
</style>
