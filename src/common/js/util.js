// 洗牌函数
export function shuffle(arr) {
  let _arr = arr.slice() //副本，这样不会直接修改参数

  for (let i = 0; i < _arr.length;i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// 返回 min和 max 之间的随机数，包括max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min) 
}