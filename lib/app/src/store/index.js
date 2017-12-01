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
    tab: 0, // 0 all 1 hasTip 2 noTip
    keyWord: '',
    lang: '',
    sort: 0, // 1 starTime 2 issues 3 createdTime 4 starCounts
    curTip: 0, // id of chooseTip not set -1 because add tip default id is -1
    allTips: [],
    allList: [],
    chooseList: []
  },
  getters: {
    getTab: state => state.tab,
    getKeyWord: state => state.keyWord,
    getLang: state => state.lang,
    getSort: state => state.sort,
    getCurTip: state => state.curTip,
    getAllTips: state => state.allTips,
    getAllList: state => state.allList,
    getChooseList: state => state.chooseList,
    getList: (state, getter) => {
      var result = getter.getAllList.filter(item => item.tips.some(tip => tip === getter.getCurTip))
      return result.map(item => Object.assign(
        {},
        item,
        {tips: item.tips.map(tip => getter.getAllTips.find(item => item.id === tip))},
        {choose: getter.getChooseList.some(id === item.id)}
      ))
    },
    getTips: (state, getters) => {
      return getters.allTips.map(item => {
        var counts = getters.getAllList.filter(item => item.tips.some(tipId => tipId === item.id)).length
        return Object.assign({}, item, {counts})
      })
    },
    getTotalCount: (state, getters) => getters.getList.length,
    getChooseCount: (state, getters) => getters.getChooseList.length,
    getLangList: (state, getters) => {
      return Array.from(new Set(getters.getAllList.map(item => item.lang)))
    }
  },
  mutations: {
    chooseItem (state, id) {
      var ind = state.findIndex(i => i === id)
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
    chooseAll (state, idList) {
      state.chooseList = idList
    },
    unChooseAll (state) {
      state.chooseList = []
    },
    setTip (state, obj) { // {id, name}
      var ind = state.allTips.findIndex(item => item.id === obj.id)
      if (ind > -1) {
        Vue.set(state.allTips, ind, obj)
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
    listAddTips (state, obj) { // {itemIds: [id], tipIds: [id]}
      obj.itemIds.forEach(itemId => {
        var ind = state.allList.findIndex(info => info.id === itemId)
        if (ind > -1) {
          state.allList[ind].tips.push(...obj.tipIds) // 去重
          state.allList[ind].tips = Array.from(new Set(state.allList[ind].tips))
          Vue.set(state.allList, ind, state.allList[ind])
        }
      })
    },
    listDelTips (state, obj) { // {itemIds: [id], tipIds: [id]}
      obj.itemIds.forEach(itemId => {
        var ind = state.allList.findIndex(info => info.id === itemId)
        if (ind > -1) {
          // 将数组转成字符串然后replace
          var str = ',' + state.allList[ind].tips.join(',') + ','
          obj.tipIds.forEach(id => { str = str.replace(`,${id},`, ',') })
          state.allList[ind].tips = str.split(',').filter(i => i).map(i => Number(i))
          Vue.set(state.allList, ind, state.allList[ind])
        }
      })
    },
    listSetTips (state, obj) { // {itemIds: [id], tipIds: [id]}
      obj.itemIds.forEach(itemId => {
        var ind = state.allList.findIndex(info => info.id === itemId)
        if (ind > -1) {
          state.allList[ind].tips = obj.tipIds
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
    changeTab ({state, getters}, value) {
      if (value === 2 && getters.getCurTip !== 0) {
        state.curTip = 0
      }
      state.tab = value
    },
    chooseTip ({state, getters}, id) {
      if (id !== 0 && getters.getTab === 2) {
        state.tab = 0
      }
      state.curTip = id
    }
  }
})
