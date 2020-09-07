<template>
  <scroll class="suggest" 
          :data="result" 
          :pullup="pullup"
          @scrollToEnd="searchMore"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <Loading v-show="hasMore" title=""></Loading>
    </ul>
  </scroll>  
</template>

<script>
import { search } from '@/api/search'
import { ERR_OK } from '@/api/config'
import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'
import Scroll from '@/base/scroll/scroll';
import Loading  from '@/base/loading/loading'


const TYPE_SINGER = 'singer'
const perpage = 20

  export default {
    data() {
      return {
        page: 1,
        result: [],
        pullup: true, //开启上滑加载
        hasMore: true, 
      }
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    components: {
      Scroll,
      Loading
    },
    watch: {
      query() {
        this.search()
      }
    },
    methods: {
      // 获取搜索接口
      search() {
        this.page = 1
        this.searchMore = true
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if(res.code === ERR_OK){
            this._getResult(res.data).then((result) => {
              // console.log(result)
              this.result = result
            })
            this._checkMore(res.data)
          }
        })
      },

      getIconCls(item) {
        if(item.type === TYPE_SINGER) {
          return 'icon-min'
        }else{
          return 'icon-music'
        }
      },  

      getDisplayName(item) {
        if(item.type === TYPE_SINGER){
          return item.singername
        }else{
          return `${item.album}-${item.singer}`
        }
      },

      // 搜索更多
      searchMore() {
        if(!this.hasMore) {
          return
        }
        this.page++ 
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then((result) => {
              this.result = this.result.concat(result)
            })
            this._checkMore(res.data)
          }
        })
      },

      // 检查是否有更多
      _checkMore(data) {
        const song = data.song
        if(!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum){
          this.hasMore = false
        }
      },
      
      _getResult(data) {
        let ret = []
        if(data.zhida && data.zhida.singerid){
          ret.push({...data.zhida, ...{type: TYPE_SINGER}}) // data.zhida 对象拷贝到空对象里面
        }
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
        })
      },

      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },

    }
  }
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>