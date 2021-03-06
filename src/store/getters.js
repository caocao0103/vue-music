export const singer = state => state.singer // 歌手

export const playing = state => state.playing 

export const fullScreen = state => state.fullScreen 

export const playlist = state => state.playlist 

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex


// getters 除了能做简单的代理之外，还可以担任计算属性的角色
export const currentSong = (state) => { 
  // 取到当前的 song, 如果取不到返回 {}
  return state.playlist[state.currentIndex] || {}
}

export const disc = state => state.disc

export const toplist = state => state.toplist

export const searchHistory = state => state.searchHistory

export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList