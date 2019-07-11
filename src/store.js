import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: getToken('token'),
    username: getToken('username')
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
  },
  actions: {
    logout({ commit }) {
      commit('SET_TOKEN',"")
      commit('SET_USERNAME',"")
      removeToken()
      router.replace('/login')
    }
  },
  getters: {
    username: state => state.username,
    token: state => state.token
  }
})
