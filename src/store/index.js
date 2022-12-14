import Vue from 'vue'
import Vuex from 'vuex'
import board from './modules/board'
import players from './modules/players'
import bag from './modules/bag'
import game from './modules/game'
import settings from './modules/settings'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    board,
    players,
    bag,
    game,
    settings
  },
  strict: debug
})