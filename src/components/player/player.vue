<template>
  <div class="player" v-show="playlist.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.album"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" 
             @touchstart.prevent="middleTouchStart" 
             @touchmove.prevent="middleTouchMove"
             @touchend.prevent="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll :data="currentLyric && currentLyric.lines" class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div class="currentLyric" v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum === index}" 
                   v-for="(line, index) in currentLyric.lines"
                   :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper">
            <img width="40" height="40" :class="cdCls" :src="currentSong.image" />
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.album"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio 
      ref="audio" 
      :src="currentSong.url" 
      @canplay="ready" 
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    >
    </audio>
  </div>
</template>

<script>
import Scroll from '@/base/scroll/scroll';
import Lyric from 'lyric-parser'
import animations from "create-keyframe-animation";
import ProgressBar from '@/base/progress-bar/progress-bar';
import ProgressCircle from '@/base/progress-circle/progress-circle';
import { mapGetters, mapMutations } from "vuex";
import { perfixStyle } from "@/common/js/dom";
import {playMode} from '@/common/js/config';
import {shuffle} from '@/common/js/util';

const transform = perfixStyle("transform");
const transitionDuration = perfixStyle('transitionDuration')

export default {
  data() {
    return {
      songReady: false, //歌曲是否准备标志位
      currentTime: 0,
      radius: 32,
      currentLyric: null, //当前歌曲的歌词
      currentLineNum: 0, //当前歌词所在的行
      currentShow: 'cd',
      playingLyric: '', //当前播放的歌词
    }
  },
  computed: {
    // 播放图标
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },

    // 旋转
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    // 不能点击
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    // 百分比， 歌曲播放的比例
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    // 播放模式
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },

    ...mapGetters([
      "fullScreen", 
      "playlist", 
      "currentSong", 
      "playing",
      "currentIndex",
      "mode",
      "sequenceList"
      ]),
  },
  created() {
    // 为什么不在data 里面定义呢，因为touch不需要添加getter或者setter
    this.touch = {} //触摸
  },
  methods: {
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`,
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`,
        },
      };

      animations.registerAnimation({
        name: "move",
        animation,
        persets: {
          duration: 400,
          easing: "linear",
        },
      });

      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";

      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    // 初始的位置和缩放比例
    _getPosAndScale() {
      const targetWidth = 40; //小圆的宽度
      const paddingLeft = 40; //小圆中心坐标距左边40的高度
      const paddingBottom = 30; //小圆中心坐标距底部30的高度
      const paddingTop = 80; // 大圆距离顶部80高度
      const width = window.innerWidth * 0.8; // 屏幕的宽度乘以0.8就是大圆的宽度
      const scale = targetWidth / width; // 缩放比例
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;

      return {
        x,
        y,
        scale,
      };
    },
    // 下一首
    next() {
      if(!this.songReady) {
        return
      }
      if(this.playlist.length === 1) { //处理歌曲列表只为 1 的情况
        this.loop()
      }else{
        let index = this.currentIndex + 1
        if(index === this.playlist.length) { //到最后一首歌时，从头开始
          index = 0
        }
        this.setCurrentIndex(index) // 修改

        if(!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    // 上一首
    prev() {
      if(!this.songReady) {
        return
      }
      if(this.playlist.length === 1) {
        this.loop()
      }else{
        let index = this.currentIndex - 1
        if(index === -1) {
          index = this.playlist.length
        }
        this.setCurrentIndex(index) // 修改

        if(!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    // 播放器已经准备好
    ready() {
      this.songReady = true
    },
    // 遇到url报错
    error() {
      this.songReady = true
    },
    // 播放完
    end() {
      if(this.mode === playMode.loop){
        this.loop()
      }else{
        this.next()
      }
    },
    // 单曲，播放完置为零实现循环播放
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.paly()
      if(this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    }, 
    // 时间戳转化为分秒
    format(interval) {
      interval = interval | 0 // 向下取整，相当于调用math.float()
      const minute = interval / 60 | 0 //分 取整
      // const second = interval % 60 //秒  取余数
      const second = this._pad(interval % 60) //秒  取余数
      return `${minute}:${second}`
    },
    // 改变播放时间
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if(!this.playing){ //播放
        this.togglePlaying()
      }
      if(this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // 用 0补位
    _pad(num, n=2) {
      let len = num.toString().length // 获取长度
      while(len < n){ //循环
        num = '0' + num 
        len++
      }
      return num
    },
    // 控制播放、暂停
    togglePlaying() {
      if(!this.songReady) {
        return
      }
      // 这样不能真正控制播放暂停，需要控制audio,所以监听
      this.setPlayingState(!this.playing);

      if(this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    
    // 改变播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      // 修改播放列表
      let list = null
      if(mode === playMode.random){
        list = shuffle(this.sequenceList)
      }else{
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
    // 获取歌词
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        // this.handleLyric 歌词每次改变的时候的回调
        this.currentLyric = new Lyric(lyric, this.handleLyric) 
        // console.log(this.currentLyric)
        if(this.playing) {
          this.currentLyric.play() //歌词播放
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    // 歌词滚动
    handleLyric({lineNum, txt}) {
      // console.log(lineNum)
      this.currentLineNum = lineNum
      if(lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      }else{
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }

      this.playingLyric = txt
    },

    middleTouchStart(e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY

    },
    middleTouchMove(e) {
      if(!this.touch.initiated){
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if(Math.abs(deltaY) > Math.abs(deltaX)){
        return
      }

      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0

      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd() {
      let offsetWidth
      let opacity
      if(this.currentShow === 'cd') { //从右向左滑
        if(this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        }else{
          offsetWidth = 0
          opacity = 1
        }
      }else{
        if(this.touch.percent < 0.9){
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        }else{
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`

      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
    },
  
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
  },

  watch: {
    currentSong(newSong, oldSong) {
      //监听当前歌曲发生变化时播放
      // 当dom已经渲染选择dom属性
      if(newSong.id === oldSong.id) {
        return
      }
      if(this.currentLyric) { //切换歌曲停止
        this.currentLyric.stop()
      }
      // this.$nextTick(() => {
      //   this.$refs.audio.play();

      //   this.getLyric() //获取歌词
      // });
      // 为了解决微信后台不执行
      setTimeout(() => {
        this.$refs.audio.play();
        this.getLyric() //获取歌词
      }, 1000)
    },

    // 监听播放状态
    playing(newPlaying) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    },
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
};
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);

            }
            &.play {
                animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
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

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;

      .imgWrapper {
        height: 100%;
        width: 100%;

        img {
          border-radius: 50%;

          &.play {
            animation: rotate 10s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>