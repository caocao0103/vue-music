import {mapGetters, mapMutations, mapActions} from 'vuex';
import { playMode } from '@/common/js/config';
import { shuffle } from '@/common/js/util';

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },

  activated() { // keep-alive组件，切过来的时候触发
    this.handlePlaylist(this.playlist)
  },

  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },

  methods: {
    // 处理 playlist
    // 组件里面定义了 handlePlaylist 函数会覆盖 mixin 里面的handlePlaylist
    // 组件里面同名的方法会覆盖 mixin 里面的方法
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode',
      'favoriteList'
    ]),
    // 播放模式
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      // 修改播放列表
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list) // 修改playlist后，要求currentsong不改变
    },

    // 保证当前currentIndex不变，歌曲不会变化
    resetCurrentIndex(list) {
      // findIndex() 返回第一个符合条件的数组成员的位置
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 喜欢的icon
    getFavoriteIcon(song) {
      if(this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    }, 
    // 标记喜欢
    toggleFavorite(song) {
      if(this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      }else{
        this.saveFavoriteList(song)
      }
    },  
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    onQueryChange(query) {
      this.query = query
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },

    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
    ])
  }
}
