// 修改数据的话，需要一个mutation
import * as types from './mutation-type';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },

  // 因为 playing 是一个布尔值，所以用flag
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },

  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },

  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },

  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },

  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },

  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST](state, list) {
    state.toplist = list
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  },
  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history
  },
  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list
  },
}

export default mutations