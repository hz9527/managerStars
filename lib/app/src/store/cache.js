const KEY = 'cacheObj' + Math.random().toString(36).slice(2)
window[KEY] = {}

function setCache (key, value) {
  window[KEY][key] = value
}

function getCache (key) {
  return window[KEY][key] || null
}

function clearCache (key) {
  if (key) {
    delete window[KEY][key]
  } else {
    window[KEY] = {}
  }
}

export {
  setCache,
  getCache,
  clearCache
}
