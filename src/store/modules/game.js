import { actionTypes, monumentTypes } from '../../common/constants'

const DEBUG = false

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
    conflictDefenderTiles: [],
    remainingMonuments: [],
    selectedMonumentType: 0
})

const defaultState = {
    activeTurnPlayerId: 1,
    currentActionPlayerId: 1,
    currentHandDisplayPlayerId: 1,
    numberOfPlayers: 0,
    remainingActions: 2,
    currentActionType: actionTypes.playTile,
    conflictAttackerPlayerId: 0,
    conflictDefenderPlayerId: 0,
    conflictAttackerTiles: [],
    conflictDefenderTiles: [],
    remainingMonuments: [
        monumentTypes.redBlue,
        monumentTypes.blueGreen,
        monumentTypes.greenRed,
        monumentTypes.blackRed,
        monumentTypes.blackGreen,
        monumentTypes.blackBlue
    ],
    selectedMonumentType: 0
}

const getters = {
    debug() {
        return DEBUG
    },
    isSaveValid() {
        if (localStorage.gameState) {
            let gameState = JSON.parse(localStorage.gameState)
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
    },
    remainingMonuments: (state) => {
        return state.remainingMonuments
    },
    selectedMonumentType: (state) => {
        return state.selectedMonumentType
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
        commit('setActionType', {actionType: actionTypes.loading})
        if (localStorage.gameState) {
            let gameState = JSON.parse(localStorage.gameState);
            commit('players/loadPlayers', gameState.players, {root: true})
            commit('board/setTiles', gameState.tiles, {root: true})
            commit('board/setTreasureCounts', gameState.tiles, {root: true})
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
    removeFromRemainingMonuments(state, payload) {
        let monumentToRemoveIndex = state.remainingMonuments.findIndex(monumentType => monumentType === payload.monumentType)
        state.remainingMonuments.splice(monumentToRemoveIndex, 1)
    },
    resetSelectedMonumentType(state) {
        state.selectedMonumentType = 0;
    },
    setSelectedMonumentType(state, payload) {
        state.selectedMonumentType = payload.monumentType
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}