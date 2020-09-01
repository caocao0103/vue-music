export const singer = state => state.singer // 歌手

export const palying = state => state.palying 

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