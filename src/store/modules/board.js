import { mapTypes, tileTypes, boardStats, actionTypes } from '../../common/constants'
import Vue from 'vue';

const state = () => ({
    map: [
        '0','0','0','0','╔','=','=','=','╝','0','0','0','║','0','0','0',
        '0','0','0','0','║','0','0','0','0','0','0','0','║','0','0','0',
        '0','0','0','╔','╝','0','0','0','0','0','0','0','╚','╗','0','0',
        '=','=','=','╝','0','0','0','0','0','0','0','0','0','╚','=','╗',
        '0','0','0','0','0','0','0','0','0','0','0','0','0','0','╔','╝',
        '0','0','0','0','0','0','0','0','0','0','0','0','0','0','║','0',
        '=','=','=','╗','0','0','0','0','0','0','0','0','╔','=','╝','0',
        '0','0','0','╚','=','=','╗','0','0','0','0','0','║','0','0','0',
        '0','0','0','0','0','0','╚','=','=','=','=','=','╝','0','0','0',
        '0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0',
        '0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'
    ],
    tiles: [],
    regions: [],
    availableTileLocations: []
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
    tile: (state) => (index) => {
        return state.tiles[index]
    },
    getNeighbors: (state) => (index) => {
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
    getRegion: (state) => (index) => {
        let regionIndex = null
        for (let i = 0; i < state.regions.length; i++) {
            if (state.regions[i].tileIndexes.includes(index)){
                regionIndex = i
                break;
            }
        }
        return regionIndex !== null ? state.regions[regionIndex] : null
    },
    getKingdomIndex: (state) => (index) => {
        var kingdoms = state.regions.filter(region => region.isKingdom)
        return kingdoms ? kingdoms.findIndex(region => region.tileIndexes.includes(index)) : null
    },
    getAvailableTileLocations: (state) => {
        return state.availableTileLocations
    },
    neighborRegions: (state, getters) => (tile) => {
        const neighbors = getters.getNeighbors(tile.index)
        const neighborRegions = []
        if (neighbors.left && neighbors.left.tileType !== tileTypes.empty)
            neighborRegions.push(getters.getRegion(neighbors.left.index))
        if (neighbors.top && neighbors.top.tileType !== tileTypes.empty)
            neighborRegions.push(getters.getRegion(neighbors.top.index))
        if (neighbors.right && neighbors.right.tileType !== tileTypes.empty)
            neighborRegions.push(getters.getRegion(neighbors.right.index))
        if (neighbors.bottom && neighbors.bottom.tileType !== tileTypes.empty)
            neighborRegions.push(getters.getRegion(neighbors.bottom.index))
        return Array.from(new Set(neighborRegions));
    }
}

const actions = {
    init ({commit, dispatch}) {
        let newTiles = []
        for (let i = 0; i < initialTiles.length; i++) {
            newTiles.push({
                index: i,
                tileType: initialTiles[i],
                isLeaderTile: false,
                playerId: 0
            })
        }
        commit('setTiles', newTiles)
        dispatch('setRegions')
    },
    handleBoardClick ({commit, rootGetters, dispatch, getters}, payload) {
        let currentPlayer = rootGetters['players/currentPlayer']
        let currentActionType = rootGetters['game/currentActionType']
        if (payload) {
            if (currentActionType === actionTypes.playTile &&
                currentPlayer.selectedTiles &&
                currentPlayer.selectedTiles.length >= 1) {
                const selectedTile = currentPlayer.selectedTiles[0]
                let availableTileLocations = getters.getAvailableTileLocations
                if (availableTileLocations && availableTileLocations.some(x => x === payload.index)) {
                    const newPayload = {...selectedTile, ...payload, playerId: currentPlayer.id}
                    const neighborKingdoms = getters.neighborRegions(newPayload).filter(x => x.isKingdom)
                    commit('addTile', newPayload)
                    dispatch('setRegions')
                    //dispatch('checkForRevolt', newPayload)
                    if (neighborKingdoms.length <= 1)
                        dispatch('checkForScoring', newPayload)
                    dispatch('players/removeSelectedTiles', {playerId: currentPlayer.id}, { root: true })
                    commit('resetAvailableTileLocations')

                    if (rootGetters['game/currentActionType'] !== actionTypes.revoltAttack)
                        commit('game/actionCompleted', null, {root: true})
                }
            }
            if (currentActionType === actionTypes.takeTreasure) {
                const tile = getters.tile(payload.index)
                if (tile.isHighlighted) {
                    commit('players/incrementScore', {playerId: rootGetters['game/currentActionPlayerId'], tileType: tileTypes.treasure}, {root: true})
                    commit('updateTile', {...tile, tileType: tileTypes.temple, isHighlighted: false})
                    let highlightedTiles = getters.tiles.filter(x => x.isHighlighted)
                    for (let i = 0; i < highlightedTiles.length; i++) {
                        commit('updateTile', {...highlightedTiles[i], isHighlighted: false})
                    }
                    commit('game/setActionType', {actionType: actionTypes.playTile}, {root: true})
                }
            }
        }
    },
    calculateAvailableTileLocations({state, getters, commit}, selectedTile) {
        let eligibleTileLocations = []
        let tileType = selectedTile.tileType
        for (let i = 0; i < state.tiles.length; i++) {
            let mapSquare = state.map[i]
            let mapSquareTile = state.tiles[i]
            if (mapSquareTile) {
                if (selectedTile.isLeaderTile) {
                    const neighborRegions = getters.neighborRegions(mapSquareTile)
                    const isJoiningKingdoms = neighborRegions.filter(region => region.isKingdom).length > 1
                    const neighbors = getters.getNeighbors(i)
                    const hasTempleNeighbor = (neighbors.left && (neighbors.left.tileType === tileTypes.temple || neighbors.left.tileType === tileTypes.treasure)) ||
                        (neighbors.top && (neighbors.top.tileType === tileTypes.temple || neighbors.top.tileType === tileTypes.treasure)) ||
                        (neighbors.bottom && (neighbors.bottom.tileType === tileTypes.temple || neighbors.bottom.tileType === tileTypes.treasure)) ||
                        (neighbors.right && (neighbors.right.tileType === tileTypes.temple || neighbors.right.tileType === tileTypes.treasure))
                    if (!isJoiningKingdoms &&
                        hasTempleNeighbor &&
                        mapSquareTile.tileType == tileTypes.empty &&
                        mapSquare === mapTypes.ground) {
                            eligibleTileLocations.push(i)
                        }
                } else {
                    // Check if square is empty and tile is able to be placed on map location (water vs ground)
                    if (mapSquareTile.tileType == tileTypes.empty &&
                        ((mapSquare !== mapTypes.ground && tileType === tileTypes.farm) ||
                         (mapSquare === mapTypes.ground && tileType !== tileTypes.farm)))
                        eligibleTileLocations.push(i)
                }
            }
        }        
        commit('setAvailableTileLocations', eligibleTileLocations)
    },
    setRegions({state, getters, commit}) {
        commit('resetRegions')
        let indexesToCheck = [...state.tiles.filter(x => x.tileType !== tileTypes.empty).map(x => x.index)]
        let checkedIndexes = []
        for (let i = 0; i < indexesToCheck.length; i++) {
            if (!checkedIndexes.some(x => x === indexesToCheck[i])) {
                let newRegionIndexes = []
                let queue = [indexesToCheck[i]]
                let isKingdom = false;
                while (queue.length > 0) {
                    const queueIndex = queue.shift()
                    if (!checkedIndexes.some(x => x === queueIndex)) {
                        newRegionIndexes.push(queueIndex)
                        checkedIndexes.push(queueIndex)
                        var indexContainsLeader = state.tiles[queueIndex]?.isLeaderTile
                        if (indexContainsLeader && !isKingdom) isKingdom = indexContainsLeader
                        const neighbors = getters.getNeighbors(queueIndex)
                        if (neighbors.left && neighbors.left.tileType !== tileTypes.empty) {
                            queue.push(neighbors.left.index)
                        }
                        if (neighbors.top && neighbors.top.tileType !== tileTypes.empty) {
                            queue.push(neighbors.top.index)
                        }
                        if (neighbors.right && neighbors.right.tileType !== tileTypes.empty) {
                            queue.push(neighbors.right.index)
                        }
                        if (neighbors.bottom && neighbors.bottom.tileType !== tileTypes.empty) {
                            queue.push(neighbors.bottom.index)
                        }
                    }
                }
                if (newRegionIndexes.length > 0) {
                    commit('addRegion', { tileIndexes: newRegionIndexes, isKingdom: isKingdom })
                }
            }
        }
    },
    checkForScoring({state, getters, commit}, payload) {
        if (payload && !payload.isLeaderTile) {
            let region = getters.getRegion(payload.index)
            if (region && region.isKingdom) {
                let matchingLeader = null
                let matchingKing = null
                let matchingTrader = null
                let foundTreasureTiles = []
                // check if kingdom has any matching leaders to score
                for (let i = 0; i < region.tileIndexes.length; i++) {
                    var matchingTile = state.tiles[region.tileIndexes[i]]
                    if (matchingTile) {
                        if (matchingTile.tileType === tileTypes.treasure)
                            foundTreasureTiles.push(matchingTile)
                        if (matchingTile.isLeaderTile) {
                            if (matchingTile.tileType === tileTypes.trader)
                                matchingTrader = matchingTile
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
                }
                if (matchingLeader !== null) {
                    commit('players/incrementScore', {playerId: matchingLeader.playerId, tileType: payload.tileType}, {root: true})
                } else if (matchingKing !== null) {
                    commit('players/incrementScore', {playerId: matchingKing.playerId, tileType: payload.tileType}, {root: true})
                }
                // If more than one treasure exists score extras
                if (foundTreasureTiles.length > 1 && matchingTrader !== null) {
                    for (let i = 0; i < foundTreasureTiles.length; i++) {
                        commit('updateTile', {...foundTreasureTiles[i], isHighlighted: true})
                    }
                    commit('game/setCurrentActionPlayerId', {playerId: matchingTrader.playerId}, {root: true})
                    commit('game/setActionType', {actionType: actionTypes.takeTreasure}, {root: true})
                }
            }
        }
    },
    checkForRevolt({state, getters, commit}, payload) {
        if (payload && payload.isLeaderTile) {
            const region = getters.getRegion(payload.index)
            if (region && region.isKingdom) {
                let matchingDefenderLeader = null
                for (let i = 0; i < region.tileIndexes.length; i++) {
                    var matchingTile = state.tiles[region.tileIndexes[i]]
                    if (matchingTile &&
                        matchingTile.isLeaderTile &&
                        matchingTile.tileType === payload.tileType &&
                        matchingTile.playerId !== payload.playerId) {
                            matchingDefenderLeader = {...matchingTile}
                    }
                }
                if (matchingDefenderLeader) {
                    commit('updateTile', {...payload, isHighlighted: true})
                    commit('updateTile', {...matchingDefenderLeader, isHighlighted: true})
                    commit('game/setCurrentActionPlayerId', {playerId: payload.playerId}, {root: true})
                    commit('game/setConflictAttackerPlayerId', {playerId: payload.playerId}, {root: true})
                    commit('game/setConflictDefenderPlayerId', {playerId: matchingDefenderLeader.playerId}, {root: true})
                    commit('game/setActionType', {actionType: actionTypes.revoltAttack}, {root: true})
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
    removeTile(state, payload) {
        let newTile = {
            index: payload.index,
            tileType: tileTypes.empty,
            isLeaderTile: false,
            playerId: 0
        }
        state.tiles.splice(payload.indes, 1, newTile)
    },
    updateTile(state, payload) {
        let matchingTile = state.tiles[payload.index]
        if (matchingTile) {
            matchingTile = {...payload}
            state.tiles.splice(payload.index, 1, matchingTile)
        }
    },
    setTiles(state, payload) {
        if (payload) {
            Vue.set(state, 'tiles', [...payload]);
        }
    },
    resetRegions(state) {
        state.regions.splice(0)
    },
    addRegion(state, payload) {
        state.regions.push({regionIndex: state.regions.length, tileIndexes: [...payload.tileIndexes], isKingdom: payload.isKingdom})
    },
    setAvailableTileLocations(state, payload) {
        if (payload) {
            Vue.set(state, 'availableTileLocations', payload)
        }
    },
    resetAvailableTileLocations(state) {
        state.availableTileLocations.splice(0)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}