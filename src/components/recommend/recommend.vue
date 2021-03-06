<template>
  <div class="recommend" ref="recommend">
    <!-- :data="discList" 把数据传给组件后就不需要重新刷新，来重新计算高度 -->
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <div class="slider-content">
            <!-- 轮播图组件 -->
            <slider ref="slider">
              <div v-for="(item, index) in recommends" :key="index">
                <a :href="item.linkUrl">
                  <img @load="loadImage" :src="item.picUrl" alt />
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="(item, index) in discList" :key="index" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading>></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Loading from '@/base/loading/loading';
import Scroll from '@/base/scroll/scroll';
import Slider from "@/base/slider/slider";
import { getRecommend, getDisList } from "@/api/recommend.js";
import { ERR_OK } from "@/api/config";
import {playlistMixin} from '@/common/js/mixin'
import {mapMutations} from 'vuex';

export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  created() {
    this._getRecommend()
    this._getDisList()
  },
  activated() {
    setTimeout(() => {
      this.$refs.slider && this.$refs.slider.refresh()
    }, 20)
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  methods: {
    
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      // 因为是vue component 所以要取到元素
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh() //重新刷新一下，让 scroll 重新计算一次
    }, 

    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })

      // 写入store
      this.setDisc(item)
    },

    // 推荐轮播
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res);
          this.recommends = res.data.slider;
        }
      });
    },
    // 歌单列表
    _getDisList() {
      getDisList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res);
          this.discList = res.data.list
        }
      });
    },

    // 监听图片加载时间
    loadImage() {
      // 调用组件里面 refresh() 方法
      if(!this.checkLoaded) { //设置一个标志位确保只执行一次
        // this.$refs.scroll.refresh()
        this.checkLoaded = true
        setTimeout(() => {
            this.$refs.scroll.refresh()
          }, 20)
      }
    },

    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
};
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
        height: 0
        padding-top: 40%
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>