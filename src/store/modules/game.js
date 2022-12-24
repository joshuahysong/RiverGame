import { actionTypes } from '../../common/constants'

const state = () => ({
    currentPlayerId: 0,
    numberOfPlayers: 0,
    remainingActions: 0,
    currentActionType: 0
})

const defaultState = {
    currentPlayerId: 1,
    numberOfPlayers: 0,
    remainingActions: 2,
    currentActionType: actionTypes.playUnit
}

const getters = {
    currentActionType(state) {
        return state.currentActionType
    },
    currentPlayerId(state) {
        return state.currentPlayerId
    },
    remainingActions(state) {
        return state.remainingActions
    },
    numberOfPlayers(state) {
        return state.numberOfPlayers
    }
}

const actions = {
    init({commit}) {
        commit('setState', defaultState)
    },
    saveGame({state, rootGetters}) {
        let gameState = {}
        gameState.players = rootGetters['players/all']
        gameState.tiles = rootGetters['board/tiles']
        gameState.bag = rootGetters['bag/all']
        gameState.game = state
        localStorage.gameState = JSON.stringify(gameState);
    },
    loadGame({commit, dispatch}) {
        if (localStorage.gameState) {
            let gameState = JSON.parse(localStorage.gameState);
            commit('players/loadPlayers', gameState.players, {root: true})
            commit('board/setTiles', gameState.tiles, {root: true})
            dispatch('board/setKingdoms', null, {root: true})
            commit('bag/setState', gameState.bag, {root: true})
            commit('setState', gameState.game)
        }
    }
}

const mutations = {
    nextActivePlayer(state) {
        state.currentPlayerId = state.currentPlayerId >= state.numberOfPlayers
            ? 1 : state.currentPlayerId + 1            
        state.remainingActions = 2
        state.currentAction = actionTypes.playUnit
    },
    incrementPlayerCount(state) {
        state.numberOfPlayers++
    },
    actionCompleted(state) {
        state.remainingActions--
    },
    setActionType(state, payload) {
        state.currentActionType = payload.actionType
    },
    setState(state, payload) {
        Object.assign(state, payload)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}