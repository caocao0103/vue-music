<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll"; //这里安装了better-scroll 1.0版本
import { addClass } from "@/common/js/dom";

export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  props: {
    loop: {
      //是否循环轮播
      type: Boolean,
      default: true,
    },
    autoPlay: {
      //自动轮播
      type: Boolean,
      default: true,
    },
    interval: {
      //自动轮播间隔
      type: Number,
      default: 4000,
    },
  },
  mounted() {
    // 保证DOM成功渲染可以加个延时
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();

      if(this.autoPlay) {
        this._play()
      }
    }, 20);

    window.addEventListener('resize', () => {
      if(!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    // 设置轮播的宽度
    _setSliderWidth(isResize) {
      // 1.获得列表所有子元素
      this.children = this.$refs.sliderGroup.children;
      // console.log(this.children.length);
      // 2.设置sliderGroup的宽度
      let width = 0;
      // 3.设置父容器的宽度
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item"); //给每个元素都添加class,确保样式是正确的

        child.style.width = sliderWidth + "px";
        width += sliderWidth; //总的宽度要累加
      }

      // 如果循环为true，左右克隆两个dom保证循环切换
      if (this.loop && !isResize) {
        // 宽度要加两倍
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    // 初始化轮播
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400,
        click: true,
      });

      // 绑定事件
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        if(this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex

        if(this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    // 初始化点
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    
    _play() {
      let pageIndex = this.currentPageIndex + 1
      if(this.loop) {
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },

  destroyed() {
    clearTimeout(this.timer)
  }
};
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    transform: translateZ(1px);
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>