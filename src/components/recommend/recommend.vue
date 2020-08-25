<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper" v-if="recommends.length">
        <!-- 轮播图组件 -->
        <slider>
          <div v-for="(item, index) in recommends" :key="index">
            <a :href="item.linkUrl">
              <img :src="item.picUrl" alt="">
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>

        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Slider from '../../base/slider/slider';
  import { getRecommend } from "../../api/recommend.js";
  import { ERR_OK } from '../../api/config';

  export default {
    data() {
      return {
        recommends: [],
      }
    },
    created() {
      this._getRecommend()
    },
    components: {
      Slider
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if(res.code === ERR_OK){
            console.log(res)
            this.recommends = res.data.slider
          }
        })
      },
    },
  }
</script>

<style lang="stylus" scoped>

</style>