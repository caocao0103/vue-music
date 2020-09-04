<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
  import MusicList from '@/components/music-list/music-list';
  import {mapGetters} from 'vuex';
  import { getMusicList } from '@/api/rank'
  import { ERR_OK } from '@/api/config'
  import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'


  export default {
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    components: {
      MusicList
    },
    computed: {
      title() {
        return this.toplist.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'toplist'
      ])
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if (!this.toplist.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.toplist.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
              this.songs = songs
            })
          }
        })
      },

      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }


    }
  }
</script>

<style lang="stylus" scoped>
 .slide-enter-active, .slide-leave-active {
    transition all 0.3s
  }
  .slide-enter, .slide-leave-to{
    transform translate3d(100%, 0, 0)
  }
</style>