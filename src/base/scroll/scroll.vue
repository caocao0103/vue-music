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
      },
      listenScroll: { //监听scroll事件
        type: Boolean,
        default: false
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
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

        if(this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }

        if(this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if(this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }

        if(this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
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
      },

      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },

      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._initScroll()
        },this.refreshDelay)
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>