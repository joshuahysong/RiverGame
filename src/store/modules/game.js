import { actionTypes } from '../../common/constants'

const state = () => ({
    activeTurnPlayerId: 0,
    currentActionPlayerId: 0,
    currentHandDisplayPlayerId: 0,
    numberOfPlayers: 0,
    remainingActions: 0,
    currentActionType: 0,
    conflictAttackerPlayerId: 0,
    conflictDefenderPlayerId: 0,
    conflictAttackerTiles: [],
    conflictDefenderTiles: []
})

const defaultState = {
    activeTurnPlayerId: 1,
    numberOfPlayers: 0,
    remainingActions: 2,
    currentActionType: actionTypes.playTile,
    currentHandDisplayPlayerId: 1,
    currentActionPlayerId: 1
}

const getters = {
    isSaveValid() {
        if (localStorage.gameState) {
            let gameState = JSON.parse(localStorage.gameState);
            return gameState.version === process.env.VUE_APP_VERSION
        }
        return false;
    },
    currentActionType(state) {
        return state.currentActionType
    },
    activeTurnPlayerId(state) {
        return state.activeTurnPlayerId
    },
    remainingActions(state) {
        return state.remainingActions
    },
    numberOfPlayers(state) {
        return state.numberOfPlayers
    },
    currentActionPlayerId: (state) => {
        return state.currentActionPlayerId
    },
    currentHandDisplayPlayerId: (state) => {
        return state.currentHandDisplayPlayerId
    },
    conflictAttackerPlayerId: (state) => {
        return state.conflictAttackerPlayerId
    },
    conflictDefenderPlayerId: (state) => {
        return state.conflictDefenderPlayerId
    }
}

const actions = {
    init({commit}) {
        commit('setState', defaultState)
    },
    save({state, rootGetters}) {
        let gameState = {}
        gameState.version = process.env.VUE_APP_VERSION
        gameState.players = rootGetters['players/all']
        gameState.tiles = rootGetters['board/tiles']
        gameState.bag = rootGetters['bag/all']
        gameState.game = state
        localStorage.gameState = JSON.stringify(gameState);
    },
    load({commit, dispatch}) {
        if (localStorage.gameState) {
            let gameState = JSON.parse(localStorage.gameState);
            commit('players/loadPlayers', gameState.players, {root: true})
            commit('board/setTiles', gameState.tiles, {root: true})
            dispatch('board/setRegions', null, {root: true})
            commit('bag/setState', gameState.bag, {root: true})
            commit('setState', gameState.game)
        }
    }
}

const mutations = {
    nextActivePlayer(state) {
        let activeTurnPlayerId = state.activeTurnPlayerId >= state.numberOfPlayers
            ? 1 : state.activeTurnPlayerId + 1
        state.activeTurnPlayerId = activeTurnPlayerId
        state.currentActionPlayerId = activeTurnPlayerId
        state.currentHandDisplayPlayerId = activeTurnPlayerId
        state.conflictAttackerPlayerId = 0
        state.conflictDefenderPlayerId = 0
        state.remainingActions = 2
        state.currentActionType = actionTypes.playTile
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
    },
    setCurrentActionPlayerId(state, payload) {
        state.currentActionPlayerId = payload.playerId
    },
    setCurrentHandDisplayPlayerId(state, payload) {
        state.currentHandDisplayPlayerId = payload.playerId
    },
    setConflictAttackerPlayerId(state, payload) {
        state.conflictAttackerPlayerId = payload.playerId
    },
    setConflictDefenderPlayerId(state, payload) {
        state.conflictDefenderPlayerId = payload.playerId
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}