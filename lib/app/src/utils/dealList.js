module.exports = {
  getItem (item) { // deal origin item
    return {
      id: item.id,
      owner: item.owner.login,
      name: item.name,
      description: item.description,
      default_branch: item.default_branch,
      language: item.language,
      forks: item.forks,
      open_issues: item.open_issues,
      watchers: item.watchers,
      html_url: item.html_url,
      clone_url: item.clone_url,
      created_at: item.created_at,
      updated_at: item.updated_at,
      tips: [],
      desc: ''
    }
  },
  mergeList (originList, localList) {
    let localIdObj = {}
    let localObj = {}
    let commonList = []
    localList.forEach(item => {
      localIdObj[item.id] = true
      localObj[item.id] = item
    })
    originList.forEach(item => {
      commonList.push(item.id)
      item = this.getItem(item)
      if (item.id in localObj) {
        localIdObj[item.id] = false
        // update local
        item.tips = localObj[item.id].tips
        item.desc = localObj[item.id].desc
      }
      localObj[item.id] = item
    })
    localIdObj = Object.keys(localIdObj).filter(id => localIdObj[id])
    localIdObj.forEach(id => {
      delete localObj[id]
    })
    return Object.keys(localObj).map(id => localObj[id])
  }
}
