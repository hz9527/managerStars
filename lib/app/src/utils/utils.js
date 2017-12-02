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

function formaTime (time) {
  var date = new Date(time)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export {
  throttle,
  formaTime
}
