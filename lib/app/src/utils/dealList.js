module.exports = {
  getItem (item) { // deal origin item
    return {
      id: item.id,
      full_name: item.full_name,
      description: item.description,
      html_url: item.html_url,
      created_at: item.created_at,
      updated_at: item.updated_at,
      clone_url: item.clone_url,
      forks: item.forks,
      open_issues: item.open_issues,
      watchers: item.watchers,
      default_branch: item.default_branch,
      language: item.language,
      tips: [],
      desc: ''
    }
  },
  mergeList (originList, localList) {
    let localIdObj = {}
    let localObj = {}
    localList.forEach(item => {
      localIdObj[item.id] = true
      localObj[item.id] = item
    })
    originList.forEach(item => {
      commonList.push(item.id)
      if (item.id in localObj) {
        localIdObj[item.id] = false
      } else {
        item = this.getItem(item)
        localObj[item.id] = item
      }
    })
    localIdObj = Object.keys(localIdObj).filter(id => localIdObj[id])
    localIdObj.forEach(id => {
      delete localObj[id]
    })
    return Object.keys(localObj).map(id => localObj[id])
  }
}
