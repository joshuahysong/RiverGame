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
    kingdoms: []
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
    getKingdom: (state) => (index) => {
        let kingdomIndex = null
        for (let i = 0; i < state.kingdoms.length; i++) {
            if (state.kingdoms[i].tileIndexes.includes(index)){
                kingdomIndex = i
                break;
            }
        }
        return kingdomIndex !== null ? state.kingdoms[kingdomIndex] : null
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
    init ({commit, dispatch}) {
        let newTiles = []
        for (let i = 0; i < initialTiles.length; i++) {
            newTiles.push({index: i, tileType: initialTiles[i], isLeaderTile: false, playerId: 0})
        }
        commit('setTiles', newTiles)
        commit('resetKingdoms')
        dispatch('setKingdoms')
    },
    handleBoardClick ({ commit, rootGetters, dispatch, getters }, payload) {
        // TODO Leader selection
        let currentPlayer = rootGetters['players/currentPlayer']
        if (payload &&
            currentPlayer.selectedTiles &&
            currentPlayer.selectedTiles.length >= 1) {
            let availableTileLocations = getters.availableTileLocations(currentPlayer.selectedTiles[0])
            if (availableTileLocations && availableTileLocations.some(x => x === payload.index)) {
                const newPayload = {...currentPlayer.selectedTiles[0], ...payload, playerId: currentPlayer.id}
                commit('addTile', newPayload)
                dispatch('setKingdoms')
                dispatch('checkForScoring', newPayload)
                dispatch('players/removeSelectedTiles', null, { root: true })
                commit('game/actionCompleted', null, {root: true})
            }
        }
    },
    setKingdoms ({state, getters, commit}) {
        for (let i = 0; i < state.tiles.length; i++) {
            if (state.tiles[i].tileType === tileTypes.empty)
                continue;

            const neighbors = getters.getNeighborTiles(i)
            //const isInKingdom = kingdoms.getKingdom(i).length > 0
            if (neighbors) {
                let foundKingdom = false;
                if (neighbors.left && neighbors.left.tileType !== tileTypes.empty) {
                    var leftKingdom = getters.getKingdom(neighbors.left.index)
                    if (leftKingdom && !leftKingdom.tileIndexes.includes(i)) {
                        foundKingdom = true;
                        commit('updateKingdom', { kingdomIndex: leftKingdom.kingdomIndex, newTileIndex: i })
                    }
                }
                if (neighbors.top && neighbors.top.tileType !== tileTypes.empty) {
                    var topKingdom = getters.getKingdom(neighbors.top.index)
                    if (topKingdom && !topKingdom.tileIndexes.includes(i)) {
                        foundKingdom = true;
                        commit('updateKingdom', { kingdomIndex: topKingdom.kingdomIndex, newTileIndex: i })
                    }
                }
                if (neighbors.right && neighbors.right.tileType !== tileTypes.empty) {
                    var rightKingdom = getters.getKingdom(neighbors.right.index)
                    if (rightKingdom && !rightKingdom.tileIndexes.includes(i)) {
                        foundKingdom = true;
                        commit('updateKingdom', { kingdomIndex: rightKingdom.kingdomIndex, newTileIndex: i })
                    }
                }
                if (neighbors.bottom && neighbors.bottom.tileType !== tileTypes.empty) {
                    var bottomKingdom = getters.getKingdom(neighbors.bottom.index)
                    if (bottomKingdom && !bottomKingdom.tileIndexes.includes(i)) {
                        foundKingdom = true;
                        commit('updateKingdom', { kingdomIndex: bottomKingdom.kingdomIndex, newTileIndex: i })
                    }
                }
                if (!foundKingdom && !getters.getKingdom(i)) {
                    commit('addKingdom', { newTileIndex: i })
                }
            }
        }
        return state.kingdoms
    },
    checkForScoring({state, getters, commit}, payload) {
        if (payload && !payload.isLeaderTile) {
            let kingdom = getters.getKingdom(payload.index)
            if (kingdom) {
                let matchingLeader = null
                let matchingKing = null
                // check if kingdom has any matching leaders to score
                for (let i = 0; i < kingdom.tileIndexes.length; i++) {
                    var matchingTile = state.tiles[kingdom.tileIndexes[i]]
                    if (matchingTile && matchingTile.isLeaderTile) {
                        if ((matchingTile.tileType === tileTypes.priest && payload.tileType === tileTypes.temple) ||
                            (matchingTile.tileType === tileTypes.king && payload.tileType === tileTypes.settlement) ||
                            (matchingTile.tileType === tileTypes.farmer && payload.tileType === tileTypes.farm) ||
                            (matchingTile.tileType === tileTypes.trader && payload.tileType === tileTypes.market)) {
                            matchingLeader = matchingTile
                        } else if (matchingTile.tileType === tileTypes.king) {
                            matchingKing = matchingTile
                        }
                    }
                }
                if (matchingLeader !== null) {
                    commit('players/incrementScore', {playerId: matchingLeader.playerId, tileType: payload.tileType}, {root: true})
                } else if (matchingKing !== null) {
                    commit('players/incrementScore', {playerId: matchingKing.playerId, tileType: payload.tileType}, {root: true})
                }
            }
        }
    }
}

const mutations = {
    addTile(state, payload) {
        if (payload && state.tiles.length - 1 >= payload.index) {
            let tile = {
                index: payload.index,
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
    },
    resetKingdoms(state) {
        state.kingdoms.splice(0)
    },
    addKingdom(state, payload) {
        state.kingdoms.push({kingdomIndex: state.kingdoms.length, tileIndexes: [payload.newTileIndex]})
    },
    updateKingdom(state, payload) {
        if (payload && state.kingdoms[payload.kingdomIndex] !== undefined) {
            state.kingdoms[payload.kingdomIndex].tileIndexes.push(payload.newTileIndex)
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