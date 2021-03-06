var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var Store = require('./data.js')
var API = require('../src/API/index.js')
var dealList = require('../src/utils/dealList.js')
var MaxAge = 30 * 60 * 1000
var lastTime = 0

var app = express()
app.use(bodyParser.json())

function OK (data) {
  return {
    code: 0,
    data: data,
    codeMsg: 'success'
  }
}

function ERR (msg) {
  return {
    code: -1,
    data: null,
    codeMsg: msg || 'fail'
  }
}
// 客户端来判断数据是否为空
// tips {userName: [{id: xx, name: xx}]}
// 暂不支持逻辑删除
// 获取用户信息
app.get(API.getUser, (req, res, next) => { // {userName, repository, img}
  Store.getData('userInfo')
    .then(data => {
      res.send(OK(data || {}))
    }).catch(msg => res.send(ERR(msg)))
})

// 检查用户是否存在
app.get(API.checkUser(), (req, res, next) => {
  var user = req.params.user
  request({
    url: `https://api.github.com/users/${user}`,
    headers: {'User-Agent': 'request'}
  }, (err, respon, body) => {
    if (err) {
      res.send(ERR('get userInfo fail'))
    } else {
      body = JSON.parse(body)
      if (body.id) {
        res.send(OK({id: body.id, img: body.avatar_url}))
      } else {
        res.send(OK({id: null})) // no exists
      }
    }
  })
})
// 检查仓库是否存在
app.get(API.checkRep(), (req, res, next) => {
  var user = req.params.user
  var repository = req.params.repo
  request({
    url: `https://api.github.com/repos/${user}/${repository}`,
    headers: {'User-Agent': 'request'}
  }, (err, respon, body) => {
    if (err) {
      res.send(ERR('get repository fail'))
    } else {
      body = JSON.parse(body)
      if (body.id) { // exists the repository
        res.send(OK({id: body.id}))
      } else {
        res.send(OK({id: null}))
      }
    }
  })
})

// 设置用户信息{userName: xx, repository: xx, img: xx}
app.post(API.setUser, (req, res, next) => {
  Store.setData('userInfo', req.body)
    .then(data => {
      res.send(OK(null))
    }).catch(msg => res.send(ERR(msg)))
})
// 获取tip列表
app.get(API.getTips(), (req, res, next) => {
  var user = req.params.user
  Store.getData('tips')
    .then(data => {
      data = data ? data[user] : []
      res.send(OK(data))
    }).catch(msg => res.send(msg))
})
// 添加tip  data {name: xx}
app.post(API.addTip(), (req, res, next) => {
  var user = req.params.user
  var name = req.body.name
  var id
  Store.getData('tips')
    .then(data => {
      if (data && data[user]) {
        id = (Math.max.apply(null, data[user].map(item => item.id)) + 1).toString()
      } else {
        !data && (data = {})
        data[user] = []
        id = '1'
      }
      data[user].push({id: id, name: name})
      return Store.setData('tips', data)
    })
    .then(d => {
      res.send(OK({tipId: id}))
    })
    .catch(msg => res.send(ERR(msg)))
})
// 删除tip query {userName: xx} data {id: xx} 不支持批量
app.delete(API.delTip(), (req, res, next) => {
  var user = req.params.user
  var id = req.params.tipId
  var backData
  var ind = -1
  Store.getData('tips')
    .then(data => {
      if (data && data[user]) {
        ind = data[user].findIndex(item => item.id === id)
      }
      if (ind !== -1) {
        backData = data[user].splice(ind, 1)[0]
        return Store.setData('tips', data)
      } else {
       return new Promise((resolve, reject) => {
         reject('tip is not exists')
       })
     }
    })
    .then(d => {
      // 删除所有带该 id star tip
      Store.getData('stars')
        .then(data => {
          var list = data ? data[user] : []
          var change = false
          list.forEach((item, i) => {
            if (item.tips.some(tip => tip === id)) {
              change = true
              list[i].tips = item.tips.filter(tipId => tipId !== id)
            }
          })
          if (change) {
            data[user] = list
            Store.setData('stars', data)
              .then(() => {
                res.send(OK({tipId: id}))
              })
              .catch(err => {
                console.log(err)
                // back add tip
                Store.getData('tips')
                  .then(data => {
                    var list = data[user]
                    list.splice(ind, 0, backData)
                    data[user] = list
                    Store.setData('tips', data)
                      .then(res => {
                        res.send(ERR('del stars tip fail'))
                      })
                      .catch(err => res.send(ERR(msg)))
                  })
              })
          } else {
            res.send(OK({tipId: id}))
          }
        })
    })
    .catch(msg => res.send(ERR(msg)))
})

// 编辑tip data {name: xx}
app.put(API.setTip(), (req, res, next) => {
  var user = req.params.user
  var id = req.params.tipId
  var name = req.body.name
  Store.getData('tips')
    .then(data => {
      var ind = -1
      if (data && data[user]) {
        ind = data[user].findIndex(item => item.id === id)
      }
      if (ind !== -1) {
        data[user][ind].name = name
        return Store.setData('tips', data)
      } else {
       return new Promise((resolve, reject) => {
         reject('tip is not exists')
       })
     }
    })
    .then(d => {
      res.send(OK({tipId: id}))
    })
    .catch(msg => res.send(ERR(msg)))
})

function getAllStars (user) {
  return new Promise((resolve, reject) => {
    request({ // github 限制100条
      url: `https://api.github.com/users/${user}/starred?page=1&per_page=100`,
      headers: {'User-Agent': 'request'}
    }, (err, res, body) => {
      if (err) {
        reject('get star data fail')
        return
      }
      var result = JSON.parse(body)
      if (result.length <= 100 && !res.headers.link) {
        resolve(result)
      } else {
        var l = res.headers.link.slice(res.headers.link.lastIndexOf('?page=') + 6, -26) - 1
        var arr = Array.apply(null, {length: l}).map((item, i) => {
          return new Promise((suc, fail) => {
            request({ // github 限制100条
              url: `https://api.github.com/users/${user}/starred?page=${i + 2}&per_page=100`,
              headers: {'User-Agent': 'request'}
            }, (err, res, body) => {
              if (err) {
                fail('get star data fail')
              } else {
                suc(JSON.parse(body))
              }
            })
          })
        })
        Promise.all(arr)
          .then(resList => {
            resList.forEach(list => {
              result = result.concat(list)
            })
            resolve(result)
          })
          .catch(err => {
            reject('get star data fail')
          })
      }
    })
  })
}
// 获取stars列表 set maxage 30 * 60 * 1000
app.get(API.getStars(), (req, res, next) => {
  var user = req.params.user
  if (Date.now() - lastTime < MaxAge) {
    Store.getData('stars')
      .then(data => {
        res.send(OK(data[user]))
      })
  } else {
    getAllStars(user)
      .then(allStars => {
        var result
        Store.getData('stars')
          .then(data => {
            result = data || {[user]: []}
            result = data || {}
            data[user] = dealList.mergeList(allStars, result[user])
            result = data
            return Store.setData('stars', result)
          })
          .then(data => {
            lastTime = Date.now()
            res.send(OK(result[user]))
          })
          .catch(err => {
            res.send(ERR(err))
          })
      }).catch(err => {
        res.send(ERR(err))
      })
  }
})
// 设置item
// type addTips delTips editTips edit由前端计算结果
// data [{id: xx, tips: [id]}] setTips
// {item: Obj, type: edit}
app.post(API.setItem(), (req, res, next) => {
  var user = req.params.user
  var reqData = req.body
  var errList = []
  Store.getData('stars')
    .then(data => {
      var list = data[user]
      if (reqData.type === 'edit') {
        var ind = list.findIndex(item => item.id === reqData.item.id)
        if (ind > -1) {
          list[ind] = reqData.item
        } else {
          reject('item is not exists')
        }
      } else {
        reqData.forEach(item => {
          var ind = list.findIndex(info => info.id === item.id)
          if (ind > -1) {
            list[ind].tips = item.tips
          } else {
            errList.push(item.id)
          }
        })
      }
      return Store.setData('stars', data)
    })
    .then(d => {
      res.send(OK(errList))
    }).catch(msg => res.send(ERR(msg)))
})

app.listen(18000, (err) => {
  if (err) {
    console.log('err in serve')
  } else {
    console.log('serve run in port 18000')
  }
})
