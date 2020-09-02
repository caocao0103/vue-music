<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <!-- 添加触摸事件要阻止浏览器的默认行为，所以要加一个prevent -->
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {perfixStyle} from '@/common/js/dom'

  const progressBtnWidth = 16
  const transform = perfixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    watch: {
      percent(newPercent) {
        // 当percent 不小于零并且不再拖动的过程中
        if(newPercent >= 0 && !this.touch.initiated){
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth// 偏移的宽度
          // this.$refs.progress.style.width = `${offsetWidth}px` //进度条的偏移
          // this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)` //小球的偏移
          this._offset(offsetWidth)
        }
      }
    },
    created() {
      // 这个touch主要作用是在几个事件共享数据的时候，把数据挂载到对象上
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
        this.touch.initiated = true //初始化
        this.touch.startX = e.touches[0].pageX //横向坐标
        this.touch.left = this.$refs.progerss.clientWidth // 开始拖动的时候当前进度条偏移了多少
      },
      progressTouchMove(e) {
        // 没有进入touchstart 直接进入 touchmove 的时候给 return 掉
        if(!this.touch.initiated) {
          return
        }
        // 横向的偏移量
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      // 松开的时候
      progressTouchEnd() {
        // 重置成false
        this.touch.initiated = false

        this._triggerPercent()
      },
      // 点击进度条
      progressClick(e) {
        const rect  = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn时候，e.offsetX获取不到
        // this._offset(e.offsetX)
        this._triggerPercent()
      },

      _offset(offsetWidth){
        this.$refs.progress.style.width = `${offsetWidth}px` //进度条的偏移
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)` //小球的偏移
      },
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progerss.clientWidth / barWidth  //运动的百分比
        this.$emit('percentChange', percent) //改变
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"

.progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>