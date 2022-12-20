import { mapTypes, tileTypes, boardStats } from '../../common/constants'
import Vue from 'vue';

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
    tiles: [],
    phase: null
})

const initialTiles = [
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
]

const getters = {
    map: (state) => {
        return state.map
    },
    tiles: (state) => {
        return state.tiles
    },
    getNeighborTiles: (state) => (index) => {
        if (state.tiles.length > 0) {
            // top left
            if (index === 0) {
                return {
                    right: state.tiles[1],
                    bottom: state.tiles[index + boardStats.columns]
                }
            // top
            } else if (index < boardStats.columns - 1) {
                return {
                    right: state.tiles[index + 1],
                    bottom: state.tiles[index + boardStats.columns],
                    left: state.tiles[index - 1]
                }
            // top right
            } else if (index === boardStats.columns - 1) {
                return {
                    bottom: state.tiles[index + boardStats.columns],
                    left: state.tiles[index - 1]
                }
            // bottom left
            } else if (index === boardStats.columns * (boardStats.rows - 1)) {
                return {
                    right: state.tiles[index + 1],
                    top: state.tiles[index - boardStats.columns]
                }
            // left side
            } else if (index > boardStats.columns - 1 && index % boardStats.columns === 0) {
                return {
                    right: state.tiles[index + 1],
                    bottom: state.tiles[index + boardStats.columns],
                    top: state.tiles[index - boardStats.columns]
                }
            // bottom right
            } else if (index === boardStats.columns * boardStats.rows - 1) {
                return {
                    top: state.tiles[index - boardStats.columns],
                    left: state.tiles[index - 1]
                }
            // right side
            } else if (index % boardStats.columns === boardStats.columns - 1) {
                return {
                    left: state.tiles[index - 1],
                    bottom: state.tiles[index + boardStats.columns],
                    top: state.tiles[index - boardStats.columns]
                }
            // bottom
            } else if (index > boardStats.columns * (boardStats.rows - 1)) {
                return {
                    right: state.tiles[index + 1],
                    top: state.tiles[index - boardStats.columns],
                    left: state.tiles[index - 1]
                }
            // middle
            } else {
                return {
                    right: state.tiles[index + 1],
                    top: state.tiles[index - boardStats.columns],
                    left: state.tiles[index - 1],
                    bottom: state.tiles[index + boardStats.columns]
                }
            }
        }
    },
    availableTileLocations: (state, getters) => (selectedTile) => {
        let eligibleTileLocations = []
        let tileType = selectedTile.tileType
        for (let i = 0; i < state.tiles.length; i++) {
            let mapSquare = state.map[i]
            let mapSquareTile = state.tiles[i]
            if (mapSquareTile) {
                if (selectedTile.isLeaderTile) {
                    let neighbors = getters.getNeighborTiles(i)
                    let hasTempleNeighbor = (neighbors.left && (neighbors.left.tileType === tileTypes.temple || neighbors.left.tileType === tileTypes.treasure)) ||
                        (neighbors.top && (neighbors.top.tileType === tileTypes.temple || neighbors.top.tileType === tileTypes.treasure)) ||
                        (neighbors.bottom && (neighbors.bottom.tileType === tileTypes.temple || neighbors.bottom.tileType === tileTypes.treasure)) ||
                        (neighbors.right && (neighbors.right.tileType === tileTypes.temple || neighbors.right.tileType === tileTypes.treasure))
                    // TODO Validate has temple neighbor
                    if (hasTempleNeighbor && mapSquareTile.tileType == tileTypes.empty
                        && mapSquare === mapTypes.ground) {
                            eligibleTileLocations.push(i)
                        }
                } else {
                    // Check if square is empty and tile is able to be placed on map location (water vs ground)
                    if (mapSquareTile.tileType == tileTypes.empty &&
                        ((mapSquare === mapTypes.water && tileType  === tileTypes.farm) ||
                         (mapSquare === mapTypes.ground && tileType  !== tileTypes.farm)))
                        eligibleTileLocations.push(i)
                }
            }
        }
        return eligibleTileLocations
    }
}

const actions = {
    handleBoardClick ({ commit, rootGetters, dispatch, getters }, payload) {
        // TODO Leader selection
        let currentPlayer = rootGetters['players/currentPlayer']
        if (payload &&
            currentPlayer.selectedTiles &&
            currentPlayer.selectedTiles.length >= 1) {
            let availableTileLocations = getters.availableTileLocations(currentPlayer.selectedTiles[0])
            if (availableTileLocations && availableTileLocations.some(x => x === payload.index)) {
                commit('addTile', {...currentPlayer.selectedTiles[0], ...payload, playerId: currentPlayer.id})
                dispatch('players/removeSelectedTiles', null, { root: true })
                commit('game/actionCompleted', null, {root: true})
            }
        }
    },
    init ({commit, getters}) {
        if (getters.tiles.length === 0) {
            let newTiles = []
            // populate empty tiles array
            for (let i = 0; i < initialTiles.length; i++) {
                newTiles.push({tileType: initialTiles[i], isLeaderTile: false, playerId: 0})
            }
            commit('setTiles', newTiles)
        }
    }
}

const mutations = {
    addTile (state, payload) {
        if (payload && state.tiles.length - 1 >= payload.index) {
            let tile = {
                tileType: payload.tileType,
                isLeaderTile: payload.isLeaderTile,
                playerId: payload?.playerId ?? 0
            }
            state.tiles.splice(payload.index, 1, tile)
        }
    },
    setTiles(state, payload) {
        if (payload) {
            Vue.set(state, 'tiles', [...payload]);
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