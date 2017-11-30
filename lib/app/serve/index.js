var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var Store = require('./data.js')
var API = require('../src/API/index.js')

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
// var router = express.Router()
// router.param('user', (req, res, next, user) => {
//   next()
// })
// router.param('repo', (req, res, next, repo) => {
//   next()
// })
// router.param('tipId', (req, res, next, tipId) => {
//   next()
// })
// router.param('itemId', (req, res, next, itemId) => {
//   next()
// })
// 客户端来判断数据是否为空
// tips {userName: [{id: xx, name: xx}]}
// 暂不支持逻辑删除
// 获取用户信息
app.get(API.getUser, (req, res, next) => {
  Store.getData('userInfo')
    .then(data => {
      res.send(OK(data || {}))
    }).catch(msg => ERR(msg))
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
        res.send(OK({id: body.id}))
      } else {
        res.send(OK({id: null}))
      }
    }
  })
})
// 检查仓库是否存在
app.get(API.checkRep(), (req, res, next) => {
  var user = req.params.user
  var repository = req.params.repo
  console.log(req.params, req.body)
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

// 设置用户信息{userName: xx, repository: xx}
app.post(API.setUser, (req, res, next) => {
  Store.setData('userInfo', req.body)
    .then(data => { // 删除列表文件
      Store.deleteFile('stars')
        .then(d => {
          res.send(OK(null))
        }).catch(msg => res.send(ERR('delete list.json fail')))
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
  var id = req.params.id
  Store.getData('tips')
    .then(data => {
      var ind = -1
      if (data && data[user]) {
        ind = data[user].findIndex(item.id === id)
      }
      if (ind !== -1) {
        data[user].split(ind, 1)
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

// 编辑tip data {name: xx}
app.set(API.setTip, (req, res, next) => {
  var user = req.params.user
  var id = req.params.tipId
  var name = req.body.name
  Store.getData('tips')
    .then(data => {
      var ind = -1
      if (data && data[user]) {
        ind = data[user].findIndex(item.id === id)
      }
      if (ind === -1) {
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

// 获取stars列表
app.get(API.getStars(), (req, res, next) => {
  var user = req.params.user
  request({
    url: `https://api.github.com/users/${user}/starred`,
    headers: {'User-Agent': 'request'}
  }, (err, respon, body) => {
    if (err) {
      res.send(ERR('get start list fail'))
    } else {
      // 合并本地列表
      
    }
  })
})
// 设置item
// type addTips delTips editTips edit
// data {itemList: [id...], tipList: [id...], type: xx} addTips delTips editTips
// {itemId: xx, tipList: [id...], des: String, type: edit}
app.post(API.setItem, (req, res, next) => {

})


app.listen(18000, (err) => {
  if (err) {
    console.log('err in serve')
  } else {
    console.log('serve run in port 18000')
  }
})
