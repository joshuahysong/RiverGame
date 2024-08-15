import { actionTypes, tileTypes } from '../../common/constants'
import helpers from '../../common/helpers'

const state = () => ({
    players: []
})

const getters = {    
    playerHand: (state, getters) => {
        if (getters.currentPlayer) {
            return getters.currentPlayer.hand
        }
        return []
    },
    currentPlayer: (state, getters, rootState, rootGetters) => {
        let currentPlayerId = rootGetters['game/currentPlayerId']
        if (state.players.filter(x => x.id === currentPlayerId).length > 0){
            return state.players.filter(x => x.id === currentPlayerId)[0]
        }
        return null;
    },
    all: (state) => {
        return state.players
    }
}

const actions = {
    async createNewPlayer({commit, state, dispatch}, payload) {
        var hand = await dispatch('bag/drawTiles', {numberOfTiles: 6}, { root: true })
        var newPlayer = {
            id: state.players.length + 1,
            hand: hand,
            leaders: [tileTypes.king, tileTypes.priest, tileTypes.farmer, tileTypes.trader],
            selectedTiles: [],
            catastropheTiles: 2,
            score: {
                temple: 0,
                market: 0,
                farm: 0,
                settlement: 0,
                treasure: 0
            },
            isHuman: payload.isHuman
        }
        commit('createNewPlayer', newPlayer)
        commit('game/incrementPlayerCount', null, { root: true })
    },
    async refillPlayerHands({commit, state, dispatch}) {
        for (const player of state.players) {
            if (player.hand.length < 6) {
                let missingTiles = 6 - player.hand.length
                let drawnTiles = await dispatch('bag/drawTiles', {numberOfTiles: missingTiles}, { root: true })
                commit('addTilesToPlayerHand', {id: player.id, tilesToAdd: drawnTiles})
            }
        }
    },
    addTileSelection({commit, getters, rootGetters, dispatch}, payload) {
        if (payload) {
            let currentActionType = rootGetters['game/currentActionType']
            let currentPlayer = getters.currentPlayer
            let isPlayTileActionType = currentActionType === actionTypes.playTile
            if (isPlayTileActionType)
                commit('clearTileSelection', {id: currentPlayer.id})

            if (payload.isLeaderTile) {
                payload = {...payload, id: currentPlayer.id, tileType: currentPlayer.leaders[payload.index]}
            } else {
                payload = {...payload, id: currentPlayer.id, tileType: currentPlayer.hand[payload.index]}
            }
            commit('addTileSelection', {id: currentPlayer.id, ...payload})

            if (isPlayTileActionType)
                dispatch('board/calculateAvailableTileLocations', {...payload}, { root: true })
        }
    },
    removeTileSelection({commit, getters}, payload) {
        let currentPlayer = getters.currentPlayer
        commit('removeTileSelection', {id: currentPlayer.id, ...payload})
        commit('board/resetAvailableTileLocations', null, { root: true })
    },
    removeSelectedTiles({commit, getters}) {
        let currentPlayer = getters.currentPlayer
        currentPlayer.selectedTiles.forEach(selectedTile => {
            if (selectedTile.isLeaderTile) {
                commit('removeLeaderFromHand', {id: currentPlayer.id, index: selectedTile.index})
            } else {
                commit('removeTileFromHand', {id: currentPlayer.id, index: selectedTile.index})
            }
        })
        commit('clearTileSelection', {id: currentPlayer.id})
    }
}

const mutations = {
    loadPlayers(state, payload) {
        state.players = [...payload]
    },
    clearPlayers(state){
        state.players.splice(0)
    },
    createNewPlayer(state, payload) {
        state.players.push(payload)
    },
    addTileSelection(state, payload) {
        state.players.filter(x => x.id === payload.id)[0].selectedTiles.push({
            index: payload.index, tileType: payload.tileType, isLeaderTile: payload.isLeaderTile
        })
    },
    removeTileSelection(state, payload) {
        let currentSelectedTiles = state.players.filter(x => x.id === payload.id)[0].selectedTiles
        let selectedTileIndex = currentSelectedTiles.findIndex(x => x.index === payload.index && x.isLeaderTile === payload.isLeaderTile)
        currentSelectedTiles.splice(selectedTileIndex, 1)
    },
    clearTileSelection(state, payload) {
        let currentSelectedTiles = state.players.filter(x => x.id === payload.id)[0].selectedTiles
        currentSelectedTiles.splice(0, currentSelectedTiles.length)
    },
    removeTileFromHand(state, payload) {
        let currentPlayerHand = state.players.filter(x => x.id === payload.id)[0].hand
        if (currentPlayerHand && currentPlayerHand.length > payload.index) {
            currentPlayerHand.splice(payload.index, 1)
        }
    },
    removeLeaderFromHand(state, payload) {
        let currentPlayerLeaders = state.players.filter(x => x.id === payload.id)[0].leaders
        if (currentPlayerLeaders && currentPlayerLeaders.length > payload.index) {
            currentPlayerLeaders.splice(payload.index, 1)
        }
    },
    addTilesToPlayerHand(state, payload) {
        let currentPlayerHand = state.players.filter(x => x.id === payload.id)[0].hand
        currentPlayerHand = [...currentPlayerHand, ...payload.tilesToAdd]
        state.players.filter(x => x.id === payload.id)[0].hand = currentPlayerHand
    },
    incrementScore(state, payload) {
        state.players.filter(x => x.id === payload.playerId)[0].score[helpers.getTileNameByType(payload.tileType)]++
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}