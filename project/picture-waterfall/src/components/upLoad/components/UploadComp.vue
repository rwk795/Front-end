<template>
  <div class="box">
    <div v-for="(item, index) in uploadFiles" :key="index">
      <UploadCard
        :img-url="item.url"
        :index="index"
        class="card"
        @removePicList="removePicList(index)"
      />
    </div>
    <input
      id="upload"
      ref="inputFile"
      type="file"
      accept="image/jpeg,image/gif,image/png"
      multiple="true"
      class="input-file"
      @change="handleFileChange"
    />
    <label for="upload">
      <div class="container">
        <div class="container-icon">+</div>
        <div class="container-text">
          点击添加图片
          <div class="tip">可以一次上传多个图片(支持格式jpg、png、gif)</div>
        </div>
      </div>
    </label>
  </div>
</template>
<script>
const fileFormat = ['jpeg', 'gif', 'png']
import UploadCard from './UploadCard.vue'
export default {
  name: 'UploadComp',
  components: { UploadCard },
  props: {
    submited: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      files: [],
      uploadFiles: [],
    }
  },
  watch: {
    submited: function () {
      this.submited && this.submitPic()
    },
  },
  methods: {
    handleFileChange(e) {
      this.files = [...e.target.files]
      if (this.fileIsIllegal(this.files)) {
        this.$refs.inputFile.value = null
        this.$message.show('上传图片只能是 png、jpeg、jpg格式!')
      } else {
        this.send(this.files)
      }
    },
    fileIsIllegal(files) {
      return files.some((item) => {
        const fileNameSuf = item.name.split('.').slice(-1)[0] //获取文件名后缀
        return !fileFormat.includes(fileNameSuf)
      })
    },
    async send(files) {
      const fileTemp = await this.readFileSync(files)
      console.log(fileTemp)
      this.uploadFiles = [...this.uploadFiles, ...fileTemp]
    },
    //批量读取文件并转成base64格式
    readFileSync(files) {
      const readFilePromise = []
      files.forEach((file) => {
        const task = new Promise((resolve, reject) => {
          var reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            resolve({
              url: reader.result,
              status: 0,
            })
          }
          reader.onerror = () => {
            reject('图片加载失败')
          }
        })
        readFilePromise.push(task)
      })
      return Promise.all(readFilePromise)
    },
    removePicList(index) {
      this.uploadFiles.splice(index, 1)
    },
    submitPic() {
      this.$axios({
        method: 'post',
        url: '/submitList', // 接口地址
        data: this.uploadFiles,
      }).then((res) => {
        // this.$message.show('提交成功!')
        // console.log('---成功')
        this.uploadFiles = []
        this.$emit('submitSuccess')
      })
    },
  },
}
</script>
<style lang="less" scoped>
.box {
  background-color: #f7f8fd;
  padding: 0 0.5rem;
  display: flex;
  flex-wrap: wrap;
  .card {
    display: inline-block;
  }
  .input-file {
    opacity: 0;
    z-index: -1;
    width: 0;
  }
  .container {
    position: relative;
    width: 12rem;
    height: 12rem;
    background-color: #f5f5f5;
    border-radius: 0.1rem;
    font-size: 0.55rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &-icon {
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      font-size: 2rem;
      text-align: center;
      border-radius: 50%;
      background-color: #02c3ff;
      margin-bottom: 1rem;
    }
    &-text {
      text-align: center;
      .tip {
        color: #cfcfcf;
      }
    }
  }
}
</style>
