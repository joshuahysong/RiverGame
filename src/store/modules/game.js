import { actionTypes } from '../../common/constants'

const state = () => ({
    currentTurnPlayerId: 0,
    currentActionPlayerId: 0,
    numberOfPlayers: 0,
    remainingActions: 0,
    currentActionType: 0
})

const defaultState = {
    currentTurnPlayerId: 1,
    numberOfPlayers: 0,
    remainingActions: 2,
    currentActionType: actionTypes.playTile
}

const getters = {
    currentActionType(state) {
        return state.currentActionType
    },
    currentTurnPlayerId(state) {
        return state.currentTurnPlayerId
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
}

const actions = {
    init({commit}) {
        commit('setState', defaultState)
    },
    save({state, rootGetters}) {
        let gameState = {}
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
        state.currentTurnPlayerId = state.currentTurnPlayerId >= state.numberOfPlayers
            ? 1 : state.currentTurnPlayerId + 1
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
        if (payload) {
            state.currentActionPlayerId = payload.playerId
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}