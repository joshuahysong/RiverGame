import Vue from 'vue'
import Vuex from 'vuex'
import board from './modules/board'
import players from './modules/players'
import bag from './modules/bag'
import game from './modules/game'
import log from './modules/log'
import settings from './modules/settings'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    board,
    players,
    bag,
    game,
    settings,
    log
  },
  strict: debug
})