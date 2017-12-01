import Axios from 'axios'
import API from './index'
import {getCache} from '../store/cache'
import {User, Repo} from '../store/cacheName'

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
    axios.get(API.checkUser(getCache(User)))
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
    axios.get(API.checkRep(getCache(User), getCache(Repo)))
      .then(res => {
        if (res.code === 0) {
          resolve(res)
        } else {
          resolve({})
        }
      })
  })
}

export {
  getUserInfo,
  setUserInfo,
  checkUser,
  checkRepo
}
