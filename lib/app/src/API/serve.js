import Axios from 'axios'
import API from './index'
import Store from '../store'
import {Bus} from '../vueUtil'
var Getters = Store.getters

var axios = Axios.create()

axios.interceptors.response.use((res) => {
  if (!(res.data && res.data.code === 0)) {
    // toast
    Bus.$emit('toast', '接口返回错误～')
  }
  return res.data || {}
}, (err) => {
  // toast
  Bus.$emit('toast', '网络错误～')
  console.log(err)
  return {}
})

function getUserInfo () {
  return new Promise(resolve => {
    axios.get(API.getUser)
      .then(res => {
        if (res.code === 0) {
          resolve(res.data)
        } else {
          resolve({})
        }
      })
  })
}

function setUserInfo (data) {
  return new Promise(resolve => {
    axios.post(API.setUser, data)
      .then(res => {
        if (res.code === 0) {
          resolve(res.data)
        } else {
          resolve({})
        }
      })
  })
}

function checkUser () {
  return new Promise(resolve => {
    axios.get(API.checkUser(Getters.getUser))
      .then(res => {
        if (res.code === 0) {
          resolve(res)
        } else {
          resolve({})
        }
      })
  })
}

function checkRepo () {
  return new Promise(resolve => {
    axios.get(API.checkRep(Getters.getUser, Getters.getRepo))
      .then(res => {
        if (res.code === 0) {
          resolve(res)
        } else {
          resolve({})
        }
      })
  })
}

function getTipList () {
  return new Promise(resolve => {
    axios.get(API.getTips(Getters.getUser))
      .then(res => {
        if (res.code === 0) {
          resolve(res.data)
        } else {
          resolve([])
        }
      })
  })
}

function getList () {
  return new Promise(resolve => {
    axios.get(API.getStars(Getters.getUser))
      .then(res => {
        if (res.code === 0) {
          resolve(res.data)
        } else {
          resolve([])
        }
      })
  })
}

function addTip (name) {
  return new Promise((resolve, reject) => {
    axios.post(API.addTip(Getters.getUser), {name})
      .then(res => {
        if (res.code === 0) {
          resolve(res.data)
        } else {
          reject(new Error('add fail'))
        }
      })
  })
}

function setTip (data) { // id name
  return new Promise((resolve, reject) => {
    axios.put(API.setTip(Getters.getUser, data.id), data)
      .then(res => {
        if (res.code === 0) {
          resolve()
        } else {
          reject(new Error('set fail'))
        }
      })
  })
}

function delTip (id) {
  return new Promise((resolve, reject) => {
    axios.delete(API.delTip(Getters.getUser, id))
      .then(res => {
        if (res.code === 0) {
          resolve()
        } else {
          reject(new Error('del fail'))
        }
      })
  })
}

function editItem (data) {
  return new Promise((resolve, reject) => {
    axios.post(API.setItem(Getters.getUser), {item: data, type: 'edit'})
      .then(res => {
        if (res.code === 0) {
          resolve()
        } else {
          reject(new Error('set item fail'))
        }
      })
  })
}

function listSaveTips (data) {
  return new Promise((resolve, reject) => {
    axios.post(API.setItem(Getters.getUser), data)
      .then(res => {
        if (res.code === 0) {
          resolve()
        } else {
          reject(new Error('set item fail'))
        }
      })
  })
}

export {
  getUserInfo,
  setUserInfo,
  checkUser,
  checkRepo,
  getTipList,
  getList,
  addTip,
  setTip,
  delTip,
  editItem,
  listSaveTips
}
