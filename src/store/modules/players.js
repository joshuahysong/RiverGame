import { actionTypes, tileTypes } from '../../common/constants'
import helpers from '../../common/helpers'

const state = () => ({
    players: []
})

const getters = {
    currentPlayer: (state, getters, rootState, rootGetters) => {
        let activeTurnPlayerId = rootGetters['game/activeTurnPlayerId']
        if (state.players.filter(x => x.id === activeTurnPlayerId).length > 0){
            return state.players.filter(x => x.id === activeTurnPlayerId)[0]
        }
        return null;
    },
    getPlayer: (state) => (playerId) => {
        let matchingPlayers = state.players.filter(x => x.id == playerId)
        if (matchingPlayers && matchingPlayers.length > 0) {
            return matchingPlayers[0]
        }
        return null
    },
    all: (state) => {
        return state.players
    }
}

const actions = {
    async createNewPlayer({commit, state, dispatch}, payload) {
        var hand = await dispatch('bag/drawTiles', { numberOfTiles: 6 }, { root: true })
        var newPlayer = {
            id: state.players.length + 1,
            name: payload.name,
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
                let drawnTiles = await dispatch('bag/drawTiles', { numberOfTiles: missingTiles }, { root: true })
                commit('addTilesToPlayerHand', { playerId: player.id, tilesToAdd: drawnTiles })
            }
        }
    },
    addTileSelection({commit, rootGetters, dispatch}, payload) {
        if (payload) {
            let currentActionType = rootGetters['game/currentActionType']
            let isPlayTileActionType = currentActionType === actionTypes.playTile
            if (isPlayTileActionType)
                commit('clearTileSelection', { ...payload })

            commit('addTileSelection', { ...payload })

            if (isPlayTileActionType)
                dispatch('board/calculateAvailableTileLocations', { ...payload }, { root: true })
        }
    },
    removeTileSelection({commit}, payload) {
        commit('removeTileSelection', { ...payload })
        commit('board/resetAvailableTileLocations', null, { root: true })
    },
    removeSelectedTiles({commit, getters}, payload) {
        let player = getters.getPlayer(payload.playerId)
        player.selectedTiles.forEach(selectedTile => {
            if (selectedTile.isLeaderTile) {
                commit('removeLeaderFromHand', { playerId: player.id, ...selectedTile })
            }
            else if (selectedTile.tileType == tileTypes.catastrophe) {
                commit('removeCatastropheFromHand', { playerId: player.id, ...selectedTile })
            } else {
                commit('removeTileFromHand', { playerId: player.id, ...selectedTile })
            }
        })
        commit('clearTileSelection', { ...payload })
        commit('board/resetAvailableTileLocations', null, { root: true })
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
        state.players.filter(x => x.id === payload.playerId)[0].selectedTiles.push({
            index: payload.index, tileType: payload.tileType, isLeaderTile: payload.isLeaderTile
        })
    },
    removeTileSelection(state, payload) {
        let selectedTiles = state.players.filter(x => x.id === payload.playerId)[0].selectedTiles
        let selectedTileIndex = selectedTiles.findIndex(x => x.index === payload.index && x.isLeaderTile === payload.isLeaderTile)
        selectedTiles.splice(selectedTileIndex, 1)
    },
    clearTileSelection(state, payload) {
        let selectedTiles = state.players.filter(x => x.id === payload.playerId)[0].selectedTiles
        selectedTiles.splice(0, selectedTiles.length)
    },
    removeTileFromHand(state, payload) {
        let playerHand = state.players.filter(x => x.id === payload.playerId)[0].hand
        if (playerHand && playerHand.length > payload.index) {
            playerHand.splice(payload.index, 1)
        }
    },
    removeTilesFromHand(state, payload) {
        let playerHand = state.players.filter(x => x.id === payload.playerId)[0].hand
        let indexesToRemove = payload.tilesToRemove.map(tileToRemove => tileToRemove.index)
        if (playerHand && playerHand.length >= indexesToRemove.length) {
            let filteredHand = playerHand.filter((x, index) => !indexesToRemove.includes(index))
            state.players.filter(x => x.id === payload.playerId)[0].hand = filteredHand
        }
    },
    removeLeaderFromHand(state, payload) {
        let playerLeaders = state.players.filter(x => x.id === payload.playerId)[0].leaders
        if (playerLeaders && playerLeaders.length > payload.index) {
            playerLeaders.splice(payload.index, 1)
        }
    },
    removeCatastropheFromHand(state, payload) {
        let player = state.players.filter(x => x.id === payload.playerId)[0]
        if (player && player.catastropheTiles > payload.index) {
            player.catastropheTiles--
        }
    },
    addTilesToPlayerHand(state, payload) {
        let playerHand = state.players.filter(x => x.id === payload.playerId)[0].hand
        playerHand = [...playerHand, ...payload.tilesToAdd]
        state.players.filter(x => x.id === payload.playerId)[0].hand = playerHand
    },
    addLeaderToPlayer(state, payload) {
        let playerLeaders = state.players.filter(x => x.id === payload.playerId)[0].leaders
        playerLeaders.push(payload.tileType)
        playerLeaders = playerLeaders.sort((a,b) => a - b);
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