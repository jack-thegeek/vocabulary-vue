import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
    searchState: JSON.parse(sessionStorage.getItem("searchState")),

  },
  mutations: {
    // set
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.setItem("token", token)
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
    },
    SET_SEARCHSTATE: (state, searchState) => {
      state.searchState = searchState
      sessionStorage.setItem("searchState", JSON.stringify(searchState))
    },
    REMOVE_INFO: (state) => {
      state.token = ''
      state.userInfo = {}
      localStorage.setItem("token", '')
      sessionStorage.setItem("userInfo", JSON.stringify(''))
    },

  },
  getters: {
    // get
    getUser: state => {
      return state.userInfo
    },
  },
  actions: {
  },
  modules: {
  }
})
