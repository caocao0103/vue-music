// DOM操作通用代码
/**
 *  
 * @param {*} el DOM对象
 * @param {*} className 
 */

// 添加className
export function addClass(el, className) {
    // 这个DOM对象有这个className时，就什么都不做
    if(hasClass(el, className)) {
        return
    }
    // 否则，获取class
    let newClass = el.className.split(' ') //把className用空格拆开
    newClass.push(className)
    el.className = newClass.join(' ')
}

// 判断是否有className
export function hasClass(el, className) {
    // 创建正则
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

// 封装
export function getData(el, name, val) {
    const perfix = 'data-'
    name = perfix + name
    if (val) {
        return el.setAttribute(name, val)
    } else {
        return el.getAttribute(name)
    }
}