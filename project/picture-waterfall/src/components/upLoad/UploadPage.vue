<template>
  <div>
    <div class="container">
      <span>上传图片：</span>
      <UploadComp
        :submited="isSubmit"
        @submitSuccess="submitSuccess"
      ></UploadComp>
    </div>
    <div class="btn" @click="submit">提交图片</div>
    <div v-if="showDialog" class="layer">
      <div class="submit">
        图片上传成功！是否继续上传？
        <div class="bottom">
          <div class="bottom-btn bottom-left" @click="goListPage">
            返回列表页
          </div>
          <div class="bottom-btn bottom-right" @click="showDialog = false">
            继续上传
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UploadComp from './components/UploadComp.vue'
export default {
  name: 'UpLoadPage',
  components: { UploadComp },
  data: () => {
    return {
      isSubmit: false,
      showDialog: false,
    }
  },
  methods: {
    submit() {
      this.isSubmit = true
    },
    submitSuccess() {
      this.isSubmit = false
      this.showDialog = true
    },
    goListPage() {
      this.$router.push('/')
    },
  },
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  /* flex-wrap: wrap; */
  // justify-content: center;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 500;
  span {
    flex-shrink: 0;
  }
}
.btn {
  margin-top: 5rem;
  background-color: #02c3ff;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 10rem;
  height: 3rem;
  line-height: 3rem;
  border-radius: 0.5rem;
  color: white;
}
.layer {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background: rgba(112, 105, 105, 0.8);
  width: 100%;
  height: 100%;
  overflow: hidden;
  .submit {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 0.3rem;
    position: absolute;
    left: 50%;
    top: 50%;
    justify-content: space-around;
    align-items: center;
    transform: translate(-50%, -50%);
    width: 25rem;
    height: 10rem;
    .bottom {
      position: relative;
      // justify-content: space-between;
      &-btn {
        display: inline-block;
        position: relative;
        width: 7rem;
        height: 2rem;
        background-color: #efefef;
        text-align: center;
        line-height: 2rem;
      }
      &-left {
        left: -5rem;
      }
      &-right {
        right: -5rem;
      }
    }
  }
}
</style>
