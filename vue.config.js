const axios = require('axios')
const bodyParser = require('body-parser')

module.exports = {
  devServer: {
    host: '',
    before: app => {
      app.get('/api/getDiscList', (req, res) => {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch(err => {
          console.log(err)
        })
      })

      app.get('/api/getCdInfo', function (req, res) { //歌单中歌曲列表
        var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          var ret = response.data
          if (typeof ret === 'string') {
            var reg = /^\w+\(({.+})\)$/
            var matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((e) => {
          console.log(e)
        })
      })

      app.get('/api/lyric', (req, res) => { //歌词
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          var ret = response.data
          if(typeof ret === 'string') {
            var reg = /^\w+\(({.+})\)$/
            var matches = ret.match(reg)
            if(matches){
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch(err => {
          console.log(err)
        })
      })

      app.post('/api/getPurlUrl', bodyParser.json(), (req, res) => { //歌曲地址
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.post(url, req.body, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          res.json(response.data)
        }).catch(err => {
          console.log(err)
        })
      })

      app.get('/api/search', (req, res) => { //搜索结果
        const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          // eslint-disable-next-line no-console
          console.log(e)
        })
      })

    }
  }
}