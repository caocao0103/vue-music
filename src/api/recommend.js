import jsonp from '../common/js/jsonp';
import {commonParams, options} from './config'

export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

    // Object.assign()方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象
    // 参考链接：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    const data = Object.assign({}, commonParams, {
        platfrom: 'h5',
        uin: 0,
        needNewCode: 1
    })

    return jsonp(url, data, options)
}