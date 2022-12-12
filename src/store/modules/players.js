import { actionTypes } from '../../common/constants'

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
    }
}

const actions = {
    createNewPlayer({commit, state, dispatch}, payload) {
        commit('bag/shuffleBag', null, { root: true })
        dispatch('bag/drawTiles', {numberOfTiles: 6}, { root: true })
            .then(hand => {
                var newPlayer = {
                    id: state.players.length + 1,
                    hand: hand,
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
            })
    },
    addTileSelection({commit, getters, rootGetters}, payload) {
        if (payload) {
            let currentActionType = rootGetters['game/currentActionType']
            let currentPlayer = getters.currentPlayer
            if (currentActionType === actionTypes.playUnit) {
                commit('clearTileSelection', {id: currentPlayer.id})
            }
            payload = {...payload, id: currentPlayer.id, tile: currentPlayer.hand[payload.index]}
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
            index: payload.index, tile: payload.tile
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}