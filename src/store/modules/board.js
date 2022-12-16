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
    },
    availableTileLocations: (state) => (tile) => {
        let eligibleTileLocations = []
        for (let i = 0; i < state.tiles.length; i++) {
            let mapSquare = state.map[i]
            let mapSquareTile = state.tiles[i]
            if (tile <= tileTypes.catastrophe) {
                // Check if tile is able to be placed on map location first (water vs ground)
                if (mapSquareTile == tileTypes.empty &&
                    ((mapSquare === mapTypes.water && tile === tileTypes.farm) ||
                     (mapSquare === mapTypes.ground && tile !== tileTypes.farm)))
                    eligibleTileLocations.push(i)
            }
        }
        return eligibleTileLocations
    }
}

const actions = {
    handleBoardClick ({ commit, rootGetters, dispatch, getters }, payload) {
        // TODO Logic to handle more than placing new tiles
        let currentPlayer = rootGetters['players/currentPlayer']
        if (payload &&
            currentPlayer.selectedTiles &&
            currentPlayer.selectedTiles.length >= 1) {
            let availableTileLocations = getters.availableTileLocations(currentPlayer.selectedTiles[0].tile)
            if (availableTileLocations && availableTileLocations.find(x => x === payload.index)) {
                commit('addTile', {...currentPlayer.selectedTiles[0], ...payload})
                dispatch('players/removeSelectedTiles', null, { root: true })
                commit('game/actionCompleted', null, {root: true})
            }
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