import { actionTypes, tileTypes } from '../../common/constants'

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
        var hand = await dispatch('bag/drawTiles', 6, { root: true })
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
        commit('addNewPlayer', newPlayer)
        commit('game/incrementPlayerCount', null, { root: true })
    },
    async refillPlayerHands({commit, state, dispatch, rootGetters}) {
        for (const player of state.players) {
            if (player.hand.length < 6) {
                let missingTiles = 6 - player.hand.length
                let drawnTiles = await dispatch('bag/drawTiles', missingTiles, { root: true })
                if (rootGetters['game/currentActionType'] === actionTypes.gameOver) break
                commit('addTilesToPlayerHand', { playerId: player.id, tilesToAdd: drawnTiles })
            }
        }
    },
    async swapTiles({commit, dispatch}, player) {
        if (player) {
            const tilesToRemove = [...player.selectedTiles]
            commit('clearTileSelection', player.id)
            commit('removeTilesFromHand', { playerId: player.id, tilesToRemove: tilesToRemove })
            let drawnTiles = await dispatch('bag/drawTiles', tilesToRemove.length, { root: true })
            commit('addTilesToPlayerHand', { playerId: player.id, tilesToAdd: drawnTiles })
        }
    },
    addTileSelection({commit, rootGetters, dispatch}, tile) {
        if (tile) {
            let currentActionType = rootGetters['game/currentActionType']
            let isPlayTileActionType = currentActionType === actionTypes.playTile
            if (isPlayTileActionType)
                commit('clearTileSelection', tile.playerId)

            commit('addTileSelection', tile)

            if (isPlayTileActionType)
                dispatch('board/calculateAvailableTileLocations', tile, { root: true })
        }
    },
    removeTileSelection({commit}, tile) {
        commit('removeTileSelection', tile)
        commit('board/resetAvailableTileLocations', null, { root: true })
    },
    removeSelectedTiles({commit, getters}, playerId) {
        let player = getters.getPlayer(playerId)
        player.selectedTiles.forEach(selectedTile => {
            if (selectedTile.isLeaderTile) {
                commit('removeLeaderFromHand', { playerId, ...selectedTile })
            }
            else if (selectedTile.tileType == tileTypes.catastrophe) {
                commit('removeCatastropheFromHand', { playerId, ...selectedTile })
            } else {
                commit('removeTileFromHand', { playerId, ...selectedTile })
            }
        })
        commit('clearTileSelection', playerId)
        commit('board/resetAvailableTileLocations', null, { root: true })
    }
}

const mutations = {
    loadPlayers(state, players) {
        state.players = [...players]
    },
    clearPlayers(state) {
        state.players.splice(0)
    },
    addNewPlayer(state, player) {
        state.players.push(player)
    },
    addTileSelection(state, tile) {
        state.players.filter(x => x.id === tile.playerId)[0].selectedTiles.push({
            index: tile.index, tileType: tile.tileType, isLeaderTile: tile.isLeaderTile
        })
    },
    removeTileSelection(state, tile) {
        let selectedTiles = state.players.filter(x => x.id === tile.playerId)[0].selectedTiles
        let selectedTileIndex = selectedTiles.findIndex(x => x.index === tile.index && x.isLeaderTile === tile.isLeaderTile)
        selectedTiles.splice(selectedTileIndex, 1)
    },
    clearTileSelection(state, playerId) {
        let selectedTiles = state.players.filter(x => x.id === playerId)[0].selectedTiles
        selectedTiles.splice(0, selectedTiles.length)
    },
    removeTileFromHand(state, tile) {
        let playerHand = state.players.filter(x => x.id === tile.playerId)[0].hand
        if (playerHand && playerHand.length > tile.index) {
            playerHand.splice(tile.index, 1)
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
    removeLeaderFromHand(state, leader) {
        let playerLeaders = state.players.filter(x => x.id === leader.playerId)[0].leaders
        if (playerLeaders && playerLeaders.includes(leader.tileType)) {
            var index = playerLeaders.indexOf(leader.tileType)
            playerLeaders.splice(index, 1)
        }
    },
    removeCatastropheFromHand(state, catastrophe) {
        let player = state.players.filter(x => x.id === catastrophe.playerId)[0]
        if (player && player.catastropheTiles > catastrophe.index) {
            player.catastropheTiles--
        }
    },
    addTilesToPlayerHand(state, payload) {
        let playerHand = state.players.filter(x => x.id === payload.playerId)[0].hand
        playerHand = [...playerHand, ...payload.tilesToAdd]
        state.players.filter(x => x.id === payload.playerId)[0].hand = playerHand
    },
    addLeaderToPlayer(state, leader) {
        let playerLeaders = state.players.filter(x => x.id === leader.playerId)[0].leaders
        playerLeaders.push(leader.tileType)
        playerLeaders = playerLeaders.sort((a,b) => a - b);
    },
    incrementScore(state, payload) {
        let scoreCount = 1
        if (payload.scoreCount) scoreCount = payload.scoreCount
        state.players.filter(x => x.id === payload.playerId)[0].score[payload.scoreName] += scoreCount
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}