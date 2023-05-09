<template>
  <div class="waterFall">
    <div v-if="showLayer" class="waterFall-layer">
      <div
        class="container"
        :style="{ width: getLayerWidth + 'px', height: getLayerHeight + 'px' }"
      >
        <div class="container-close" @click="closeLayer">X</div>
        <div class="container-card">
          <div
            :class="[
              'container-card-change',
              { 'container-card-hide': isFirst },
            ]"
            @click="lastPic"
          >
            &lt;
          </div>
          <transition
            type="transition"
            name="next"
            :leave-active-class="`animate__animated animate__fadeOut${leave} next-leave-active`"
            :enter-active-class="`animate__animated animate__fadeIn${enter} next-enter-active`"
          >
            <Card
              :key="curIndex"
              :img-url="curItem"
              :card-width="getLayerHeight * 0.9"
              class="container-card-content"
            />
          </transition>
          <div
            :class="[
              'container-card-change',
              { 'container-card-hide': isFinally },
            ]"
            @click="nextPic"
          >
            &gt;
          </div>
        </div>
      </div>
    </div>
    <ReFlash @refreshEmit="refreshEmit" @loadMoreEmit="loadMoreEmit">
      <div class="wrap">
        <div v-for="(item, index) in picList" :key="index">
          <Card
            :img-url="item"
            :card-width="getCardWidth"
            @picBig="openLayer(item, index)"
          ></Card>
        </div>
        <!-- <button @click="loadMore">ssss</button> -->
      </div>
    </ReFlash>
  </div>
</template>
<script>
import Card from './Card'
import ReFlash from './ReFlash.vue'
const COLUMN = 2
export default {
  name: 'WaterFall',
  components: {
    Card,
    ReFlash,
  },
  data: () => ({
    showLayer: false,
    curItem: '', //当前图片链接
    curIndex: 0, //当前图片下标
    curClientWidth: '', //当前浏览器宽度
    getCardWidth: '', //图片大小
    getLayerWidth: '', //点击图片蒙层宽度
    getLayerHeight: '', //点击图片蒙层高度
    isFinally: false, //是否是最后一个图片
    isFirst: false, //是否是第一个图片
    leave: 'Left', //切换图片方向
    enter: 'Right', //切换图片方向
    picList: [],
    picListIndex: 0,
  }),
  watch: {
    curIndex: function () {
      this.isFinally = this.curIndex === this.picList.length - 1
      this.isFirst = this.curIndex === 0
    },
  },
  mounted() {
    this.curClientWidth = document.body.clientWidth //当前浏览器页面宽度
    this.getCardWidth = this.curClientWidth / COLUMN //大图图片宽度
    this.getLayerWidth = Math.min(this.curClientWidth * 0.95, 1200) //图片容器宽度
    this.getLayerHeight = this.getLayerWidth * 0.6 //图片容器高度
    window.onresize = () => {
      this.curClientWidth = document.body.clientWidth
      this.getCardWidth = this.curClientWidth / COLUMN
      this.getLayerWidth = Math.min(this.curClientWidth * 0.95, 1200)
      this.getLayerHeight = this.getLayerWidth * 0.6
    }
    //初始化图片数据
    this.getPicList()
  },
  methods: {
    getPicList(index = 0, count = 8, isRefresh = true) {
      this.$axios({
        method: 'get',
        url: '/api/getPicList', // 接口地址
        params: {
          index,
          count,
        },
      }).then((picList) => {
        if (isRefresh) {
          this.picList = picList
        } else {
          this.picList.push(...picList)
        }
        this.picListIndex = index + picList.length
      })
    },
    //打开蒙层
    openLayer(item, index) {
      this.curIndex = index
      this.curItem = item
      this.showLayer = true
    },
    //关闭蒙层
    closeLayer() {
      this.showLayer = false
    },
    lastPic() {
      this.curIndex--
      this.curItem = this.picList[this.curIndex]
      this.leave = 'Right'
      this.enter = 'Left'
    },
    nextPic() {
      this.curIndex++
      this.curItem = this.picList[this.curIndex]
      this.leave = 'Left'
      this.enter = 'Right'
    },
    refreshEmit() {
      this.getPicList()
    },
    loadMoreEmit() {
      this.getPicList(this.picListIndex, 6, false)
    },
  },
}
</script>

<style lang="less" scoped>
.waterFall {
  &-layer {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.8);
    width: 100%;
    height: 100%;
    overflow: hidden;
    .container {
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: black;
      &-close {
        color: white;
        position: absolute;
        right: 10px;
        font-size: 1.5rem;
      }
      &-card {
        display: flex;
        flex-direction: row;
        position: relative;
        align-items: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        &-change {
          z-index: 1;
          color: white;
          position: relative;
          font-size: 3rem;
        }
        &-hide {
          visibility: hidden;
        }
        &-content {
          position: relative;
          margin: 0 auto;
        }
        .next-enter-active {
          transition: all 3s linear;
        }
      }
    }
  }
  .wrap {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    flex-wrap: wrap;
  }
}
</style>
