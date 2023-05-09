<template>
  <img :src="imgUrl" :width="cardWidth" :height="cardWidth" @click="bigPic" />
</template>
<script>
export default {
  name: 'ImgCard',
  props: {
    imgUrl: {
      type: String,
      default: '',
    },
    cardWidth: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    bigPic() {
      this.$emit('picBig')
    },
  },
}
</script>
