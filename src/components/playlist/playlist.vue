<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlay" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll :refreshDelay="refreshDelay" ref="listContent" :data="sequenceList" class="list-content">
          <transition-group name="list" tag="ul">
            <li ref="listItem" class="item" v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.album}}</span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm @confirm="confrimClear" ref="confirm" text="是否清空？" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
// import {mapGetters, mapMutations, mapActions} from 'vuex';
import {mapActions} from 'vuex';
import Scroll from '@/base/scroll/scroll';
import {playMode} from '@/common/js/config';
import Confirm from '@/base/confirm/confirm';
import {playerMixin} from '@/common/js/mixin';
import AddSong from '@/components/add-song/add-song';

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlay: false,
        refreshDelay: 100
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    },
    // computed: {
    //   ...mapGetters([
    //     'sequenceList',
    //     'currentSong',
    //     'playlist',
    //     'mode'
    //   ])
    // },
    computed: {
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      }
    },
    watch: {
      currentSong(newSong, oldSong) {
        if(!this.showFlay || newSong.id === oldSong.id) {
          return
        }
        this.scrollToCurrent(newSong)
      }
    },
    methods: {
      show() {
        this.showFlay = true

        // 确保 scroll 计算的高度是正确的
        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent(this.currentSong)
        }, 20)
      },
      hide() {
        this.showFlay = false
      },
      // 获取当前播放的 icon 
      getCurrentIcon(item){
        if(this.currentSong.id === item.id){
          return 'icon-play'
        }else{
          return ''
        }
      },
      // 选择歌曲
      selectItem(item, index) {
        if(this.mode === playMode.random) {
          index = this.playlist.findIndex((song) => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      // 列表滚动到当前歌曲
      scrollToCurrent(current) {
        const index = this.sequenceList.findIndex((song) => {
          return current.id === song.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
      },

      // 删除一首歌曲
      deleteOne(item) {
        this.deleteSong(item)
        if(!this.playlist.length) {
          this.hide()
        }
      },

      showConfirm() {
        this.$refs.confirm.show()
      },
      confrimClear() {
        this.deleteSongList()
        this.hide()
      },

      addSong() {
        this.$refs.addSong.show()
      },

      // ...mapMutations({
      //   setCurrentIndex: 'SET_CURRENT_INDEX',
      //   setPlayingState: 'SET_PLAYING_STATE'
      // }),
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ])
    }
  }
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>