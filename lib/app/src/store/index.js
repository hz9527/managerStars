import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    user: '',
    repo: ''
  },
  getters: {
    getUser: state => state.user,
    getRepo: state => state.repo
  },
  mutations: {
    setUser (state, name) {
      state.user = name
    },
    setRepo (state, repo) {
      state.repo = repo
    }
  }
})
