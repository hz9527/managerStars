import Axios from 'axios'
import API from './index'
import Store from '../store'
var Getters = Store.getters

var axios = Axios.create()

axios.interceptors.response.use((res) => {
  if (!(res.data && res.data.code === 0)) {
    // toast
  }
  return res.data || {}
}, (err) => {
  // toast
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
    axios(API.getStars(Getters.getUser))
      .then(res => {
        if (res.code === 0) {
          resolve(res.data)
        } else {
          resolve([])
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
  getList
}
