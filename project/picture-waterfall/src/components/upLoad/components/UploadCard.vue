<template>
  <div class="card">
    <div class="icon" @click="removePic">X</div>
    <img :src="imgUrl" />
  </div>
</template>
<script>
export default {
  name: 'ImgCard',
  props: {
    imgUrl: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
      default: -1,
    },
  },
  methods: {
    removePic() {
      this.$emit('removePicList')
    },
  },
}
</script>
<style lang="less" scoped>
.card {
  position: relative;
  .icon {
    margin-top: 0.3rem;
    width: 1rem;
    height: 1rem;
    font-size: 0.5rem;
    text-align: center;
    color: white;
    line-height: 1rem;
    position: absolute;
    right: 0.7rem;
    border-radius: 50%;
    background-color: #363638;
  }
  img {
    width: 12rem;
    height: 12rem;
    border-radius: 0.5rem;
    margin-right: 0.5rem;
  }
}
</style>
