var fs = require('fs')
var path = require('path')
var resolvePath = (p = '') => path.join(__dirname, '../src/data', p)
module.exports = {
  fileConf: {
    userInfo: 'user.json',
    tips: 'tips.json',
    stars: 'list.json'
  },
  cache: {},
  getData (file) {
    return new Promise((resolve, reject) => {
      if (!this.fileConf[file]) {
        reject('file is invalid')
        return
      }
      if (file in this.cache) {
        resolve(this.cache[file])
      } else {
        if (!fs.existsSync(resolvePath(this.fileConf[file]))) {
          this.setData(file, null)
            .then(d => {
              this.cache[file] = null
              resolve(this.cache[file])
            }).catch(msg => reject(msg))
        } else {
          fs.readFile(resolvePath(this.fileConf[file]), (err, fd) => {
            if (err) {
              reject('read file error')
              return
            }
            // this.cache[file] = new Function('return ' + fd.toString())()
            this.cache[file] = fd.toString() ? JSON.parse(fd) : null
            resolve(this.cache[file])
          })
        }
      }
    })
  },
  setData (file, data) {
    return new Promise((resolve, reject) => {
      var fd = JSON.stringify(data, null, ' ')
      fs.writeFile(resolvePath(this.fileConf[file]), fd, (err) => {
        if (err) {
          reject('write err')
        } else {
          this.cache[file] = data
          resolve()
        }
      })
    })
  },
  deleteFile (file) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(resolvePath(this.fileConf[file]))) {
        resolve()
      } else {
        fs.unlink(resolvePath(this.fileConf[file]), err => {
          if (err) {
            reject('delete fail')
          } else {
            delete this.cache[file]
            resolve()
          }
        })
      }
    })
  }
}
