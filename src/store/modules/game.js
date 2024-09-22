import { actionTypes, conflictTypes, messageTypes, monumentTypes, tileTypes } from '../../common/constants'
import helpers from '../../common/helpers'

const DEBUG = false

const state = () => ({
    turnPlayerId: 0,
    actionPlayerId: 0,
    visiblePlayerId: 0,
    numberOfPlayers: 0,
    remainingActions: 0,
    currentActionType: actionTypes.loading,
    conflictType: conflictTypes.none,
    conflictAttackerLeader: null,
    conflictDefenderLeader: null,
    conflictAttackerTiles: [],
    conflictDefenderTiles: [],
    conflictAttackerBoardTiles: [],
    conflictDefenderBoardTiles: [],
    conflictTileType: tileTypes.empty,
    conflictWinnerPlayerId: 0,
    remainingMonuments: [],
    selectedMonumentType: 0,
    snapshot: null
})

const defaultState = {
    turnPlayerId: 1,
    actionPlayerId: 1,
    visiblePlayerId: 0,
    numberOfPlayers: 0,
    remainingActions: 2,
    currentActionType: actionTypes.playTile,
    conflictType: conflictTypes.none,
    conflictAttackerLeader: null,
    conflictDefenderLeader: null,
    conflictAttackerTiles: [],
    conflictDefenderTiles: [],
    conflictAttackerBoardTiles: [],
    conflictDefenderBoardTiles: [],
    conflictTileType: tileTypes.empty,
    conflictWinnerPlayerId: 0,
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
    turnPlayerId(state) {
        return state.turnPlayerId
    },
    actionPlayerId: (state) => {
        return state.actionPlayerId
    },
    visiblePlayerId: (state) => {
        return state.visiblePlayerId
    },
    remainingActions(state) {
        return state.remainingActions
    },
    numberOfPlayers(state) {
        return state.numberOfPlayers
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
    conflictAttackerBoardTiles: (state) => {
        return state.conflictAttackerBoardTiles
    },
    conflictDefenderBoardTiles: (state) => {
        return state.conflictDefenderBoardTiles
    },
    conflictTileType: (state) => {
        return state.conflictTileType
    },
    remainingMonuments: (state) => {
        return state.remainingMonuments
    },
    selectedMonumentType: (state) => {
        return state.selectedMonumentType
    },
    hasSnapshot: (state) => {
        return !!state.snapshot
    },
    conflictType: (state) => {
        return state.conflictType
    },
    conflictWinnerPlayerId: (state) => {
        return state.conflictWinnerPlayerId
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
        commit('setActionType', actionTypes.loading)
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
        snapshot.game.turnPlayerId = state.turnPlayerId,
        snapshot.game.actionPlayerId = state.actionPlayerId,
        snapshot.game.visiblePlayerId = state.visiblePlayerId,
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
    resolveConflict({getters, commit, dispatch}) {
        let winner = null
        let loser = null
        let winnerStrength = 0
        let loserStrength = 0
        let loserTiles = []
        const attackerStrength = getters.conflictAttackerBoardTiles.length + getters.conflictAttackerTiles.length
        const defenderStrength = getters.conflictDefenderBoardTiles.length + getters.conflictDefenderTiles.length
        if (attackerStrength > defenderStrength) {
            winnerStrength = attackerStrength
            loserStrength = defenderStrength
            winner = { ...getters.conflictAttackerLeader }
            loser = { ...getters.conflictDefenderLeader }
            loserTiles = [...getters.conflictDefenderBoardTiles]
        } else {
            winnerStrength = defenderStrength
            loserStrength = attackerStrength
            winner = { ...getters.conflictDefenderLeader }
            loser = { ...getters.conflictAttackerLeader }
            loserTiles = [...getters.conflictAttackerBoardTiles]
        }
        if (getters.conflictType === conflictTypes.revolt) {
            commit('players/incrementScore', {
                playerId: winner.playerId,
                scoreName: helpers.getTileNameByType(tileTypes.temple)
            }, { root: true })
        } else {
            let scoreCount = 0
            for (const loserTile of loserTiles) {
                if (loserTile.hasTreasure) continue
                if (loserTile.tileType === getters.conflictTileType) {
                    scoreCount++
                    commit('board/removeTile', { index: loserTile.index }, { root: true })
                }
            }
            commit('players/incrementScore', {
                playerId: winner.playerId,
                scoreName: helpers.getTileNameByType(getters.conflictTileType),
                scoreCount: scoreCount
            }, { root: true })
        }
        commit('players/addLeaderToPlayer', loser, { root: true })
        commit('board/removeTile', { index: loser.index }, { root: true })
        commit('board/resetBoardTileHighlights', null, { root:true })
        dispatch('board/checkForDisplacedLeader', null, { root: true })
        dispatch('board/setRegions', null, { root: true })
        commit('setConflictWinnerPlayerId', winner.playerId)
        commit('log/logActionMessage', {
            text: `${helpers.getLogToken(winner)} (${winnerStrength})
                wins the ${(getters.conflictType === conflictTypes.revolt ? 'Revolt' : 'War')}
                against ${helpers.getLogToken(loser)} (${loserStrength})`
        }, { root: true })
    }
}

const mutations = {
    nextActivePlayer(state) {
        let turnPlayerId = state.turnPlayerId >= state.numberOfPlayers
            ? 1 : state.turnPlayerId + 1
        state.turnPlayerId = turnPlayerId
        state.actionPlayerId = turnPlayerId
        state.remainingActions = 2
        state.currentActionType = actionTypes.playTile
    },
    incrementPlayerCount(state) {
        state.numberOfPlayers++
    },
    actionCompleted(state) {
        state.remainingActions--
    },
    setActionType(state, actionType) {
        state.currentActionType = actionType
    },
    setState(state, newState) {
        Object.assign(state, newState)
    },
    setActionPlayerId(state, playerId) {
        if (state.visiblePlayerId !== playerId)
            state.visiblePlayerId = 0
        state.actionPlayerId = playerId
    },
    setVisiblePlayerId(state, playerId) {
        state.visiblePlayerId = playerId
    },
    setConflictAttackerLeader(state, leader) {
        state.conflictAttackerLeader = { ...leader }
    },
    setConflictDefenderLeader(state, leader) {
        state.conflictDefenderLeader = { ...leader }
    },
    setConflictAttackerTiles(state, tiles) {
        state.conflictAttackerTiles = [...tiles]
    },
    setConflictDefenderTiles(state, tiles) {
        state.conflictDefenderTiles = [...tiles]
    },
    setConflictAttackerBoardTiles(state, tiles) {
        state.conflictAttackerBoardTiles = [...tiles]
    },
    setConflictDefenderBoardTiles(state, tiles) {
        state.conflictDefenderBoardTiles = [...tiles]
    },
    setConflictTileType(state, tileType) {
        state.conflictTileType = tileType
    },
    resetConflictData(state) {
        state.conflictAttackerLeader = null
        state.conflictDefenderLeader = null
        state.conflictAttackerTiles = []
        state.conflictDefenderTiles = []
        state.conflictAttackerBoardTiles = [],
        state.conflictDefenderBoardTiles = [],
        state.conflictTileType = tileTypes.empty
        state.conflictWinnerPlayerId = 0
        state.conflictType = conflictTypes.none
    },
    removeFromRemainingMonuments(state, monumentType) {
        let monumentToRemoveIndex = state.remainingMonuments.findIndex(m => m === monumentType)
        state.remainingMonuments.splice(monumentToRemoveIndex, 1)
    },
    resetSelectedMonumentType(state) {
        state.selectedMonumentType = 0;
    },
    setSelectedMonumentType(state, monumentType) {
        state.selectedMonumentType = monumentType
    },
    setSnapshot(state, snapshot) {
        state.snapshot = { ...snapshot }
    },
    clearSnapshot(state) {
        state.snapshot = null
    },
    setConflictType(state, conflictType) {
        state.conflictType = conflictType
    },
    setConflictWinnerPlayerId(state, playerId) {
        state.conflictWinnerPlayerId = playerId
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}