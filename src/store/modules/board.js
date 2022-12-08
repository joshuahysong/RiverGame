import { mapTypes, tileTypes } from '../../common/constants'

const state = () => ({
    map: [
        0,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,
        0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,
        0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,
        1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
        1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,
        0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,
        0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ],
    tiles: [
        0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,
        0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
        0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
        0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0
    ],
    phase: null
})

const getters = {
    map: (state) => {
        return state.map
    },
    tiles: (state) => {
        return state.tiles
    }
}

const actions = {
    handleBoardClick ({ commit, state, rootGetters }, payload) {
        // TODO Logic to handle more than placing new tiles
        let currentPlayer = rootGetters['players/currentPlayer']
        let mapSquare = state.map[payload.index]
        let mapSquareTile = state.tiles[payload.index]
        if (payload &&
            currentPlayer.selectedTile &&
            mapSquareTile === mapTypes.ground &&
            ((mapSquare === mapTypes.water && currentPlayer.selectedTile.tile === tileTypes.farm) ||
                mapSquare === mapTypes.ground && currentPlayer.selectedTile.tile !== tileTypes.farm)) {
            commit('addTile', {...currentPlayer.selectedTile, ...payload})
        }
    }
}

const mutations = {
    addTile (state, payload) {
        if (payload && state.tiles.length - 1 >= payload.index) {
            state.tiles.splice(payload.index, 1, payload.tile)
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