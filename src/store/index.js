import Vue from 'vue'
import Vuex from 'vuex'
import board from './modules/board'
import players from './modules/players'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    board,
    players
  },
  strict: debug
})