// action有种，1.异步操作，2.mutation的封装

// 比如某个动作触发多个 mutation 的时候，可以把这些 mutation 都用 action封装，
// 然后通过调用 一个 action 来达到修改多个 mutation 的目的


// actions里面有 包含可以解构commit，state的对象， 这个对象里面有commit方法，state属性，
// 第二参数，是要修改什么，告诉列表和索引是什么
import * as types from './mutation-type';
import {playMode} from '../common/js/config';
import { shuffle } from '../common/js/util';

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