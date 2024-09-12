import { actionTypes, messageTypes, monumentTypes, tileTypes } from '../../common/constants'
import helpers from '../../common/helpers'

const DEBUG = false

const state = () => ({
    activeTurnPlayerId: 0,
    currentActionPlayerId: 0,
    currentHandDisplayPlayerId: 0,
    numberOfPlayers: 0,
    remainingActions: 0,
    currentActionType: 0,
    conflictAttackerLeader: null,
    conflictDefenderLeader: null,
    conflictAttackerTiles: [],
    conflictDefenderTiles: [],
    remainingMonuments: [],
    selectedMonumentType: 0,
    snapshot: null
})

const defaultState = {
    activeTurnPlayerId: 1,
    currentActionPlayerId: 1,
    currentHandDisplayPlayerId: 1,
    numberOfPlayers: 0,
    remainingActions: 2,
    currentActionType: actionTypes.playTile,
    conflictAttackerLeader: null,
    conflictDefenderLeader: null,
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
    selectedMonumentType: 0,
    snapshot: null
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
    conflictAttackerLeader: (state) => {
        return state.conflictAttackerLeader
    },
    conflictDefenderLeader: (state) => {
        return state.conflictDefenderLeader
    },
    conflictAttackerTiles: (state) => {
        return state.conflictAttackerTiles
    },
    conflictDefenderTiles: (state) => {
        return state.conflictDefenderTiles
    },
    remainingMonuments: (state) => {
        return state.remainingMonuments
    },
    selectedMonumentType: (state) => {
        return state.selectedMonumentType
    },
    hasSnapshot: (state) => {
        return !!state.snapshot
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
        let messages =  rootGetters['log/messages']
        gameState.log = messages.filter(x => x.messageType != messageTypes.system)
        gameState.game = state
        localStorage.gameState = JSON.stringify(gameState);
    },
    load({commit, dispatch}) {
        commit('setActionType', { actionType: actionTypes.loading })
        if (localStorage.gameState) {
            let gameState = JSON.parse(localStorage.gameState);
            commit('players/loadPlayers', gameState.players, { root: true })
            commit('board/setTiles', gameState.tiles, { root: true })
            commit('board/setTreasureCounts', gameState.tiles, { root: true })
            dispatch('board/setRegions', null, { root: true })
            commit('bag/setState', gameState.bag, { root: true })
            commit('log/setMessages', gameState.log, { root: true })
            commit('setState', gameState.game)
            commit('log/logSystemMessage', 'Game load successful.', { root: true })
        }
    },
    saveSnapshot({state, rootGetters, commit}) {
        let snapshot = {}
        let players = rootGetters['players/all']
        snapshot.players = []
        players.forEach(player => {
            // I know... but it works for deep cloning. Don't hate me
            snapshot.players.push(JSON.parse(JSON.stringify({...player, selectedTiles: []})))
        })
        snapshot.log = JSON.parse(JSON.stringify(rootGetters['log/messages']))
        snapshot.tiles = [...rootGetters['board/tiles']]
        snapshot.bag = rootGetters['bag/all']
        snapshot.game = {}
        snapshot.game.activeTurnPlayerId = state.activeTurnPlayerId,
        snapshot.game.currentActionPlayerId = state.currentActionPlayerId,
        snapshot.game.currentHandDisplayPlayerId = state.currentHandDisplayPlayerId,
        snapshot.game.remainingActions = state.remainingActions,
        snapshot.game.currentActionType = state.currentActionType,
        snapshot.game.conflictAttackerLeader = { ...state.conflictAttackerLeader },
        snapshot.game.conflictDefenderLeader = { ...state.conflictDefenderLeader },
        snapshot.game.conflictAttackerTiles = [...state.conflictAttackerTiles],
        snapshot.game.conflictDefenderTiles = [...state.conflictDefenderTiles],
        snapshot.game.remainingMonuments = [...state.remainingMonuments],
        snapshot.game.selectedMonumentType = 0
        commit('setSnapshot', { ...snapshot })
    },
    restoreSnapshot({state, getters, commit, dispatch}) {
        if (getters.hasSnapshot) {
            commit('players/loadPlayers', state.snapshot.players, { root: true })
            commit('board/setTiles', state.snapshot.tiles, { root: true })
            commit('board/setTreasureCounts', state.snapshot.tiles, { root: true })
            dispatch('board/setRegions', null, { root: true })
            commit('bag/setState', state.snapshot.bag, { root: true })
            commit('log/setMessages', [...state.snapshot.log], { root: true })
            commit('setState', { ...state, ...state.snapshot.game })
        }
    },
    resolveConflict({getters, rootGetters, commit, dispatch}) {
        let isRevolt = getters.currentActionType === actionTypes.revoltDefend
        let winner = null
        let loser = null
        let winnerStrength = 0
        let loserStrength = 0
        if (isRevolt) {
            let attackerStrength = rootGetters['board/getRevoltBoardStrength'](getters.conflictAttackerLeader).length +
                getters.conflictAttackerTiles.length
            let defenderStrength = rootGetters['board/getRevoltBoardStrength'](getters.conflictDefenderLeader).length +
                getters.conflictDefenderTiles.length
            if (attackerStrength > defenderStrength) {
                winnerStrength = attackerStrength
                loserStrength = defenderStrength
                winner = { ...getters.conflictAttackerLeader }
                loser = { ...getters.conflictDefenderLeader }
            } else {
                winnerStrength = defenderStrength
                loserStrength = attackerStrength
                winner = { ...getters.conflictDefenderLeader }
                loser = { ...getters.conflictAttackerLeader }
            }
            commit('players/incrementScore', {
                playerId: winner.playerId,
                scoreName: helpers.getTileNameByType(tileTypes.temple)
            }, { root: true })
            commit('players/addLeaderToPlayer', loser, { root: true })
            commit('board/removeTile', { index: loser.index }, { root: true })
        }
        commit('resetConflictData')
        commit('board/resetBoardTileHighlights', null, { root:true })
        dispatch('board/setRegions', null, { root: true })
        commit('log/logActionMessage', {
            text: `{${winner.playerId}|${winner.tileType}} (${winnerStrength})
                wins the ${(isRevolt ? 'Revolt' : 'War')}
                against {${loser.playerId}|${loser.tileType}} (${loserStrength})`
        }, { root: true })
    }
}

const mutations = {
    nextActivePlayer(state) {
        let activeTurnPlayerId = state.activeTurnPlayerId >= state.numberOfPlayers
            ? 1 : state.activeTurnPlayerId + 1
        state.activeTurnPlayerId = activeTurnPlayerId
        state.currentActionPlayerId = activeTurnPlayerId
        state.currentHandDisplayPlayerId = activeTurnPlayerId
        state.conflictAttackerLeader = null
        state.conflictDefenderLeader = null
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
    setConflictAttackerLeader(state, payload) {
        state.conflictAttackerLeader = { ...payload }
    },
    setConflictDefenderLeader(state, payload) {
        state.conflictDefenderLeader = { ...payload }
    },
    setConflictAttackerTiles(state, payload) {
        state.conflictAttackerTiles = [...payload.tiles]
    },
    setConflictDefenderTiles(state, payload) {
        state.conflictDefenderTiles = [...payload.tiles]
    },
    resetConflictData(state) {
        state.conflictAttackerLeader = null
        state.conflictDefenderLeader = null
        state.conflictAttackerTiles = []
        state.conflictDefenderTiles = []
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
    },
    setSnapshot(state, snapshot) {
        state.snapshot = {...snapshot}
    },
    clearSnapshot(state) {
        state.snapshot = null
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}