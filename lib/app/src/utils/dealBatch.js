function getBatchResult (type, tips, list) {
  // type addTips delTips editTips; tips tip ids; list choose item
  // if add check item tips has all if del del if it has if save check is same
  let result = [] // [{id: id, tips: [id]}]
  if (type === 'addTips') {
    list.forEach(item => {
      let set = new Set(item.tips.concat(tips))
      if (set.size > item.tips.length) {
        result.push({
          id: item.id,
          tips: Array.from(set)
        })
      }
    })
  } else if (type === 'delTips') {
    let set = new Set(tips)
    list.forEach(item => {
      let res = item.tips.filter(id => !set.has(id))
      if (res.length < item.tips.length) {
        result.push({
          id: item.id,
          tips: res
        })
      }
    })
  } else {
    let str = tips.join(',')
    let res = tips.map(id => id)
    list.forEach(item => {
      if (item.tips.join(',') !== str) {
        result.push({
          id: item.id,
          tips: res
        })
      }
    })
  }
  return result
}

export {getBatchResult}
