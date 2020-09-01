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

// 对musiclist里面的webkit属性进行封装
let elementStyle = document.createElement('div').style

// 供应商
let vendor = (() => {
    let transformName = {
        webkit: 'webkitTransform', //谷歌
        Moz: 'MozTransform', // 火狐
        o: 'OTransform', //欧朋
        ms: 'msTransform', //ie
        standard: 'transform'  //标准
    }

    for (let key in transformName) {
        // 判断是那种供应商
        if(elementStyle[transformName[key]] !== undefined){
            return key
        }
    }

    // 如果都不支持
    return false
})()

export function perfixStyle(style) {
    if(vendor === false) {
        return false
    }

    if(vendor == 'standard'){
        return style
    }
    
    // style.charAt(0).topUpperCase()首字母大写，style.substr(1)再加上剩余部分
    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}