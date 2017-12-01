function throttle (time) {
  var timer = null
  return function fn (cb) {
    if (!timer) {
      timer = setTimeout(() => {
        cb()
        clearTimeout(timer)
        timer = null
      }, time)
    }
  }
}

export {throttle}
