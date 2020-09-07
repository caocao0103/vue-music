// action有种，1.异步操作，2.mutation的封装

// 比如某个动作触发多个 mutation 的时候，可以把这些 mutation 都用 action封装，
// 然后通过调用 一个 action 来达到修改多个 mutation 的目的


// actions里面有 包含可以解构commit，state的对象， 这个对象里面有commit方法，state属性，
// 第二参数，是要修改什么，告诉列表和索引是什么
import * as types from './mutation-type';
import {playMode} from '../common/js/config';
import { shuffle } from '../common/js/util';
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from '../common/js/cache';

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if(state.mode === playMode.random) { //当前的播放模式
    let randomlist = shuffle(list)
    commit(types.SET_PLAYLIST, randomlist)
    index = findIndex(randomlist, list[index])
  }else{
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// export const selectPlay = function ({ commit, state }, { list, index }) {
//   commit(types.SET_SEQUENCE_LIST, list)
//   commit(types.SET_PLAYLIST, list)
//   commit(types.SET_CURRENT_INDEX, index)
//   commit(types.SET_FULL_SCREEN, true)
//   commit(types.SET_PLAYING_STATE, true)
// }

// 循环播放
export const randomPlay = function({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)

  let randomlist = shuffle(list)
  commit(types.SET_PLAYLIST, randomlist)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 从搜索中播放歌曲
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice() //操作副本，不会影响原来的
  let sequenceList = state.sequenceList.slice() 
  let currentIndex = state.currentIndex

  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲所以索引要加一
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含这首歌
  if(fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if(currentIndex > fpIndex){
      playlist.splice(fpIndex, 1)
      currentIndex--
    }else{
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentIndex, 0, song)

  if(fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    }else{
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 本地缓存
export const saveSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 本地缓存
export const deleteSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 删除全部本地缓存
export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 歌曲列表中删除歌曲
export const deleteSong = function ({ commit,state }, song) {
  let playlist = state.playlist.slice() //操作副本，不会影响原来的
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if(currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
  // if(!playlist.length) {
  //   commit(types.SET_PLAYING_STATE, false)
  // }else{
  //   commit(types.SET_PLAYING_STATE, true)
  // }
}

export const deleteSongList = function({commit}){
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 修改喜欢
export const saveFavoriteList = function ({commit}, song) { 
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) { 
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}