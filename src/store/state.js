import {playMode} from '@/common/js/config'

// state里面只保留最基础的数据，在基础数据上可以计算来的数据放在getters里
const state = {
  singer: {}, //歌手数据
  playing: false, //播放、暂停
  fullScreen: false, //全屏
  playlist: [], //播放列表
  sequenceList: [], //排序列表
  mode: playMode.sequence,// 播放模式
  currentIndex: -1 // 当前播放的索引
}

export default state