<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    props: {
      // 指定组件监听事件
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      },20)
    },
    methods: {
      _initScroll() {
        // 没有值的是否这个方法被调用了
        if(!this.$refs.wrapper){
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
      },

      enable() {
        // 如果这个this.scroll 是有的，就调用this.scroll.enable()
        this.scroll && this.scroll.enable()
      },

      disable() {
        this.scroll && this.scroll.disable()
      },

      refresh() {
        this.scroll && this.scroll.refresh()
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._initScroll()
        },20)
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>