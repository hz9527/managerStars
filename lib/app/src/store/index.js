import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
// 完全依赖于其他state的使用getters，在变更时还会变更其他的state，请用actions
// allTips只需要关心增删及name变更
// allList只需要关心tips增删及desc变更
// 其他交给getList及getTips处理
// changeTab需要判断curTip
// changeCurTip需要判断tab
// 算法优化的事回头再说
export default new Vuex.Store({
  state: {
    user: '',
    repo: '',
    img: '',
    tab: 0, // 0 all 1 hasTip 2 noTip
    keyWord: '',
    lang: -1, // string null
    sort: 0, // 0 starTime 1 issues 2 createdTime 3 updateTime 4 starCounts 5 forkCounts
    curTip: 0, // id of chooseTip not set -1 because add tip default id is -1
    allTips: [],
    allList: [],
    chooseList: []
  },
  getters: {
    getUser: state => state.user,
    getRepo: state => state.repo,
    getImg: state => state.img,
    getTab: state => state.tab,
    getKeyWord: state => state.keyWord,
    getLang: state => state.lang,
    getSort: state => state.sort,
    getCurTip: state => state.curTip,
    getAllTips: state => state.allTips,
    getAllList: state => state.allList,
    getChooseList: state => state.chooseList,
    getList: (state, getters) => {
      // filter tab lang curTip keyWord  sort sort
      let check = []
      let result
      if (getters.getTab !== 0) {
        if (getters.getTab === 1) {
          check.push(item => item.tips.length > 0)
        } else if (getters.getTab === 2) {
          check.push(item => item.tips.length === 0)
        }
      }
      if (getters.getLang !== -1) {
        check.push(item => item.language === getters.getLang)
      }
      if (getters.getCurTip !== 0) {
        check.push(item => item.tips.some(id => id === getters.getCurTip))
      }
      if (getters.getKeyWord) { // 支持描述 name搜索
        check.push(item => item.name.indexOf(getters.getKeyWord) > -1 ||
          item.description.indexOf(getters.getKeyWord) > -1 ||
          item.desc.indexOf(getters.getKeyWord) > -1)
      }
      result = getters.getAllList.map(item => {
        let show = check.every(fn => fn(item))
        return Object.assign({}, item, {show})
      })
      if (getters.getSort !== 0) { // 0 starTime 1 issues 2 createdTime 3 updateTime 4 starCounts
        if (getters.getSort === 1) { // issues up
          result.sort((pre, next) => pre.open_issues - next.open_issues)
        } else if (getters.getSort === 2) { // ctime down
          result.sort((pre, next) => new Date(next.created_at) - new Date(pre.created_at))
        } else if (getters.getSort === 3) { // utime down
          result.sort((pre, next) => new Date(next.updated_at) - new Date(pre.updated_at))
        } else if (getters.getSort === 4) { // starC down
          result.sort((pre, next) => next.watchers - pre.watchers)
        } else if (getters.getSort === 5) { // fork down
          result.sort((pre, next) => next.forks - pre.forks)
        }
      }
      return result
    },
    getTips: (state, getters) => {
      return getters.getAllTips.map(item => {
        var counts = getters.getAllList.filter(info => info.tips.some(tipId => tipId === item.id)).length
        return Object.assign({}, item, {counts})
      })
    },
    getTotalCount: (state, getters) => getters.getList.filter(item => item.show).length,
    getChooseCount: (state, getters) => getters.getChooseList.length,
    getLangList: (state, getters) => {
      let list = getters.getAllList.map(item => item.language)
      list.unshift('不限')
      return Array.from(new Set(list))
    }
  },
  mutations: {
    setInitValue: (state, obj) => { // {key, value}
      state[obj.key] = obj.value
    },
    setUser: (state, user) => {
      state.user = user
    },
    setRepo: (state, repo) => {
      state.repo = repo
    },
    setImg: (state, img) => {
      state.img = img
    },
    setCurTip (state, v) {
      state.curTip = v
    },
    setTab (state, v) {
      state.tab = v
    },
    chooseItem (state, id) {
      var ind = state.chooseList.findIndex(i => i === id)
      if (ind === -1) {
        state.chooseList.push(id)
      } else {
        state.chooseList.splice(ind, 1)
      }
    },
    setKeyWord: (state, str) => {
      state.keyWord = str
    },
    setLang: (state, lang) => {
      state.lang = lang
    },
    setSort: (state, sort) => {
      state.sort = sort
    },
    unChooseAll: (state) => {
      state.chooseList = []
    },
    setTip (state, obj) { // {id, name newId}
      var ind = state.allTips.findIndex(item => item.id === obj.id)
      if (ind > -1) {
        var data = {id: obj.newId || obj.id, name: obj.name}
        Vue.set(state.allTips, ind, data)
      }
    },
    addTip (state, obj) { // {id, name} id -1
      state.allTips.push(obj)
    },
    delTip (state, id) {
      var ind = state.allTips.findIndex(item => item.id === id)
      if (ind > -1) {
        state.allTips.splice(ind, 1)
      }
    },
    // listAddTips (state, obj) { // {itemIds: [id], tipIds: [id]}
    //   obj.itemIds.forEach(itemId => {
    //     var ind = state.allList.findIndex(info => info.id === itemId)
    //     if (ind > -1) {
    //       state.allList[ind].tips.push(...obj.tipIds) // 去重
    //       state.allList[ind].tips = Array.from(new Set(state.allList[ind].tips))
    //       Vue.set(state.allList, ind, state.allList[ind])
    //     }
    //   })
    // },
    // listDelTips (state, obj) { // {itemIds: [id], tipIds: [id]}
    //   obj.itemIds.forEach(itemId => {
    //     var ind = state.allList.findIndex(info => info.id === itemId)
    //     if (ind > -1) {
    //       // 将数组转成字符串然后replace
    //       var str = ',' + state.allList[ind].tips.join(',') + ','
    //       obj.tipIds.forEach(id => { str = str.replace(`,${id},`, ',') })
    //       state.allList[ind].tips = str.split(',').filter(i => i)
    //       Vue.set(state.allList, ind, state.allList[ind])
    //     }
    //   })
    // },
    // listSetTips (state, obj) { // {itemIds: [id], tipIds: [id]}
    //   obj.itemIds.forEach(itemId => {
    //     var ind = state.allList.findIndex(info => info.id === itemId)
    //     if (ind > -1) {
    //       state.allList[ind].tips = obj.tipIds
    //       Vue.set(state.allList, ind, state.allList[ind])
    //     }
    //   })
    // },
    listSaveTips (state, list) { // [{id: id, tips: [id]}]
      list.forEach(item => {
        var ind = state.allList.findIndex(info => info.id === item.id)
        if (ind > -1) {
          state.allList[ind].tips = item.tips
          Vue.set(state.allList, ind, state.allList[ind])
        }
      })
    },
    editItem (state, obj) {
      var ind = state.allList.findIndex(info => info.id === obj.id)
      Vue.set(state.allList, ind, obj)
    }
  },
  actions: {
    changeTab ({commit, getters}, value) {
      if (value === 2 && getters.getCurTip !== 0) {
        commit('setCurTip', 0)
      }
      commit('setTab', value)
    },
    chooseTip ({commit, getters}, id) {
      if (id !== 0 && getters.getTab === 2) {
        commit('setTab', 0)
      }
      commit('setCurTip', id)
    },
    chooseAll ({state, getters}) {
      state.chooseList = getters.getList.filter(item => item.show).map(item => item.id)
    }
  }
})
