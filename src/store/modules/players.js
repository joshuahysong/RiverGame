import { actionTypes, tileTypes } from '../../common/constants'

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
        commit('bag/shuffleBag', null, { root: true })
        var hand = await dispatch('bag/drawTiles', {numberOfTiles: 6}, { root: true })
        var newPlayer = {
            id: state.players.length + 1,
            hand: hand,
            leaders: [tileTypes.king, tileTypes.priest, tileTypes.farmer, tileTypes.trader],
            // TODO Leaders
            selectedTiles: [],
            score: {
                red: 0,
                green: 0,
                blue: 0,
                black: 0,
                wild: 0
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
    addTileSelection({commit, getters, rootGetters}, payload) {
        if (payload) {
            let currentActionType = rootGetters['game/currentActionType']
            let currentPlayer = getters.currentPlayer
            if (currentActionType === actionTypes.playUnit) {
                commit('clearTileSelection', {id: currentPlayer.id})
            }
            if (payload.isLeaderTile) {
                payload = {...payload, id: currentPlayer.id, tile: currentPlayer.leaders[payload.index]}
            } else {
                payload = {...payload, id: currentPlayer.id, tile: currentPlayer.hand[payload.index]}
            }
            commit('addTileSelection', {id: currentPlayer.id, ...payload})
        }
    },
    removeSelectedTiles({commit, getters}) {
        let currentPlayer = getters.currentPlayer
        currentPlayer.selectedTiles.forEach(selectedTile => {
            commit('removeTileFromHand', {id: currentPlayer.id, index: selectedTile.index})
        })
        commit('clearTileSelection', {id: currentPlayer.id})
    }
}

const mutations = {
    createNewPlayer (state, payload) {
        state.players.push(payload)
    },
    addTileSelection (state, payload) {
        state.players.filter(x => x.id == payload.id)[0].selectedTiles.push({
            index: payload.index, tile: payload.tile, isLeaderTile: payload.isLeaderTile
        })
    },
    clearTileSelection (state, payload) {
        let currentSelectedTiles = state.players.filter(x => x.id == payload.id)[0].selectedTiles
        currentSelectedTiles.splice(0, currentSelectedTiles.length)
    },
    removeTileFromHand (state, payload) {
        let currentPlayerHand = state.players.filter(x => x.id == payload.id)[0].hand
        if (currentPlayerHand && currentPlayerHand.length > payload.index) {
            currentPlayerHand.splice(payload.index, 1)
        }
    },
    addTilesToPlayerHand (state, payload) {
        let currentPlayerHand = state.players.filter(x => x.id == payload.id)[0].hand
        currentPlayerHand = [...currentPlayerHand, ...payload.tilesToAdd]
        state.players.filter(x => x.id == payload.id)[0].hand = currentPlayerHand
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}