import {mapGetters} from 'vuex';

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