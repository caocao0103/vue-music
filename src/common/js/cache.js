// storage
import storage from 'good-storage';

const SEARCH_KEY = '__search__' //这种编码，一般是内部的
const SEARCH_MAX_LENGTH = 15 //搜索保存的最大值

const PLAY_KEY =" __play__" // 播放历史
const PLAY_MAX_LENGTH = 200 

// 插入数组
function insertArray(arr, val, compare, maxLen) { //compare是一个 function
  const index = arr.findIndex(compare) //查找 arr 中有没有val

  // 如果有且是第一个就什么都不做
  if(index === 0) { //是第一条数据
    return
  }
  // 如果有 删掉之后再插入
  if(index > 0){
    arr.splice(index, 1)
  }
  arr.unshift(val)
  
  if(maxLen && arr.length > maxLen){
    arr.pop()
  }
}

// 把 query 插入到历史列表中，插入完以后再把保存，再把新的数组 return 出去
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) // 没有存过的话，默认是一个空数组

  insertArray(searches, query, (item) => {
    return item === query 
  }, SEARCH_MAX_LENGTH)

  storage.set(SEARCH_KEY, searches)

  return searches
} 

// 从本地缓存读取初始值
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}


function deleteFormArray(arr, compare) {
  const index = arr.findIndex(compare) //查找 arr 中有没有val
  if(index > -1){
    arr.splice(index, 1)
  }
}

// 删除
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) // 没有存过的话，默认是一个空数组
  deleteFormArray(searches, (item) => {
    return item === query
  })

  storage.set(SEARCH_KEY, searches)
  return searches
}

// 删除全部
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 储存播放历史
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])

  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)

  storage.set(PLAY_KEY, songs)

  return songs
} 

// 读取
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}