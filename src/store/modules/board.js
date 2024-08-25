import { mapTypes, tileTypes, boardStats, actionTypes, monumentTypes } from '../../common/constants'
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
    availableTileLocations: [],
    availableMonumentLocations: []
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
    kingdoms: (state) => {
        return state.regions.filter(region => region.isKingdom)
    },
    getNeighbors: (state) => (index) => {
        if (state.tiles.length > 0) {
            // top left corner
            if (index === 0) {
                return {
                    right: state.tiles[1],
                    bottomRight: state.tiles[index + boardStats.columns + 1],
                    bottom: state.tiles[index + boardStats.columns]
                }
            // top edge
            } else if (index < boardStats.columns - 1) {
                return {
                    right: state.tiles[index + 1],
                    bottomRight: state.tiles[index + boardStats.columns + 1],
                    bottom: state.tiles[index + boardStats.columns],
                    bottomLeft: state.tiles[index + boardStats.columns - 1],
                    left: state.tiles[index - 1]
                }
            // top right corner
            } else if (index === boardStats.columns - 1) {
                return {
                    bottom: state.tiles[index + boardStats.columns],
                    bottomLeft: state.tiles[index + boardStats.columns - 1],
                    left: state.tiles[index - 1]
                }
            // bottom left corner
            } else if (index === boardStats.columns * (boardStats.rows - 1)) {
                return {
                    top: state.tiles[index - boardStats.columns],
                    topRight: state.tiles[index - boardStats.columns + 1],
                    right: state.tiles[index + 1]
                }
            // left edge
            } else if (index > boardStats.columns - 1 && index % boardStats.columns === 0) {
                return {
                    top: state.tiles[index - boardStats.columns],
                    topRight: state.tiles[index - boardStats.columns + 1],
                    right: state.tiles[index + 1],
                    bottomRight: state.tiles[index + boardStats.columns + 1],
                    bottom: state.tiles[index + boardStats.columns]
                }
            // bottom right corner
            } else if (index === boardStats.columns * boardStats.rows - 1) {
                return {
                    top: state.tiles[index - boardStats.columns],
                    left: state.tiles[index - 1],
                    topLeft: state.tiles[index - boardStats.columns - 1]
                }
            // right edge
            } else if (index % boardStats.columns === boardStats.columns - 1) {
                return {
                    top: state.tiles[index - boardStats.columns],
                    bottom: state.tiles[index + boardStats.columns],
                    bottomLeft: state.tiles[index + boardStats.columns - 1],
                    left: state.tiles[index - 1],
                    topLeft: state.tiles[index - boardStats.columns - 1]
                }
            // bottom edge
            } else if (index > boardStats.columns * (boardStats.rows - 1)) {
                return {
                    top: state.tiles[index - boardStats.columns],
                    topRight: state.tiles[index - boardStats.columns + 1],
                    right: state.tiles[index + 1],
                    left: state.tiles[index - 1],
                    topLeft: state.tiles[index - boardStats.columns - 1]
                }
            } else {
                return {
                    top: state.tiles[index - boardStats.columns],
                    topRight: state.tiles[index - boardStats.columns + 1],
                    right: state.tiles[index + 1],
                    bottomRight: state.tiles[index + boardStats.columns + 1],
                    bottom: state.tiles[index + boardStats.columns],
                    bottomLeft: state.tiles[index + boardStats.columns - 1],
                    left: state.tiles[index - 1],
                    topLeft: state.tiles[index - boardStats.columns - 1]
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
    availableMonumentLocations: (state) => {
        return state.availableMonumentLocations
    },
    neighborRegions: (state, getters) => (tile) => {
        const neighbors = getters.getNeighbors(tile.index)
        const neighborRegions = []
        if (neighbors.left &&
            neighbors.left.tileType !== tileTypes.empty &&
            neighbors.left.tileType !== tileTypes.catastrophe)
            neighborRegions.push(getters.getRegion(neighbors.left.index))
        if (neighbors.top &&
            neighbors.top.tileType !== tileTypes.empty &&
            neighbors.top.tileType !== tileTypes.catastrophe)
            neighborRegions.push(getters.getRegion(neighbors.top.index))
        if (neighbors.right &&
            neighbors.right.tileType !== tileTypes.empty &&
            neighbors.right.tileType !== tileTypes.catastrophe)
            neighborRegions.push(getters.getRegion(neighbors.right.index))
        if (neighbors.bottom &&
            neighbors.bottom.tileType !== tileTypes.empty &&
            neighbors.bottom.tileType !== tileTypes.catastrophe)
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
                    dispatch('checkForDisplacedLeader')
                    //dispatch('checkForRevolt', newPayload)
                    if (neighborKingdoms.length <= 1)
                        dispatch('checkForTileScore', newPayload)
                    dispatch('checkForTreasureToTake', newPayload)
                    dispatch('players/removeSelectedTiles', {playerId: currentPlayer.id}, { root: true })
                    commit('resetAvailableTileLocations')
                    dispatch('checkForMonument', newPayload)

                    if (rootGetters['game/currentActionType'] === actionTypes.playTile)
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
                    commit('game/setCurrentActionPlayerId', {playerId: rootGetters['game/activeTurnPlayerId']}, {root: true})
                    commit('game/setActionType', {actionType: actionTypes.playTile}, {root: true})
                }
            }
        }
    },
    calculateAvailableTileLocations({state, getters, commit}, selectedTile) {
        let eligibleTileLocations = []
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
                } else if (selectedTile.tileType === tileTypes.catastrophe) {
                    if (mapSquareTile.tileType !== tileTypes.treasure &&
                        mapSquareTile.tileType !== tileTypes.catastrophe &&
                        mapSquareTile.tileType !== tileTypes.monumentBottomLeft &&
                        mapSquareTile.tileType !== tileTypes.monumentBottomRight &&
                        mapSquareTile.tileType !== tileTypes.monumentTopLeft &&
                        mapSquareTile.tileType !== tileTypes.monumentTopRight &&
                        !mapSquareTile.isLeaderTile)
                        eligibleTileLocations.push(i)
                } else {
                    if (mapSquareTile.tileType == tileTypes.empty &&
                        ((mapSquare !== mapTypes.ground && selectedTile.tileType === tileTypes.farm) ||
                         (mapSquare === mapTypes.ground && selectedTile.tileType !== tileTypes.farm)))
                        eligibleTileLocations.push(i)
                }
            }
        }        
        commit('setAvailableTileLocations', eligibleTileLocations)
    },
    setRegions({state, getters, commit}) {
        commit('resetRegions')
        let indexesToCheck = [...state.tiles
            .filter(x => x.tileType !== tileTypes.empty && x.tileType !== tileTypes.catastrophe)
            .map(x => x.index)]
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
                        let indexContainsLeader = state.tiles[queueIndex]?.isLeaderTile
                        if (indexContainsLeader && !isKingdom) isKingdom = indexContainsLeader
                        const neighbors = getters.getNeighbors(queueIndex)
                        if (neighbors.left &&
                            neighbors.left.tileType !== tileTypes.empty &&
                            neighbors.left.tileType !== tileTypes.catastrophe) {
                            queue.push(neighbors.left.index)
                        }
                        if (neighbors.top &&
                            neighbors.top.tileType !== tileTypes.empty &&
                            neighbors.top.tileType !== tileTypes.catastrophe) {
                            queue.push(neighbors.top.index)
                        }
                        if (neighbors.right &&
                            neighbors.right.tileType !== tileTypes.empty &&
                            neighbors.right.tileType !== tileTypes.catastrophe) {
                            queue.push(neighbors.right.index)
                        }
                        if (neighbors.bottom &&
                            neighbors.bottom.tileType !== tileTypes.empty &&
                            neighbors.bottom.tileType !== tileTypes.catastrophe) {
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
    checkForTileScore({state, getters, commit}, payload) {
        if (payload && !payload.isLeaderTile) {
            let region = getters.getRegion(payload.index)
            if (region && region.isKingdom) {
                let matchingLeader = null
                let matchingKing = null
                // check if kingdom has any matching leaders to score
                for (let i = 0; i < region.tileIndexes.length; i++) {
                    let matchingTile = state.tiles[region.tileIndexes[i]]
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
    },
    checkForTreasureToTake({state, getters, commit}, payload) {
        let region = getters.getRegion(payload.index)
        if (region && region.isKingdom) {
            let matchingTrader = null
            let foundTreasureTiles = []
            for (let i = 0; i < region.tileIndexes.length; i++) {
                let matchingTile = state.tiles[region.tileIndexes[i]]
                if (matchingTile) {
                    if (matchingTile.tileType === tileTypes.treasure)
                        foundTreasureTiles.push(matchingTile)
                    if (matchingTile.tileType === tileTypes.trader) {
                        matchingTrader = matchingTile
                    }
                }
            }
            if (foundTreasureTiles.length > 1 && matchingTrader !== null) {
                for (let i = 0; i < foundTreasureTiles.length; i++) {
                    commit('updateTile', {...foundTreasureTiles[i], isHighlighted: true})
                }
                commit('game/setCurrentActionPlayerId', {playerId: matchingTrader.playerId}, {root: true})
                commit('game/setActionType', {actionType: actionTypes.takeTreasure}, {root: true})
            }
        }
    },
    checkForMonument({getters, commit}, payload) {
        commit('resetAvailableMonumentLocations')
        var neighbors = getters.getNeighbors(payload.index)
        let top = neighbors.top?.tileType ?? tileTypes.empty
        let topRight = neighbors.topRight?.tileType  ?? tileTypes.empty
        let right = neighbors.right?.tileType  ?? tileTypes.empty
        let bottomRight = neighbors.bottomRight?.tileType  ?? tileTypes.empty
        let bottom = neighbors.bottom?.tileType  ?? tileTypes.empty
        let bottomLeft =neighbors.bottomLeft?.tileType  ?? tileTypes.empty
        let left = neighbors.left?.tileType  ?? tileTypes.empty
        let topLeft = neighbors.topLeft?.tileType ?? tileTypes.empty

        let foundAvailableMonumentLocations = []
        if ([topLeft, top, left].every(x => x === payload.tileType))
            foundAvailableMonumentLocations.push({ index: neighbors.topLeft.index, tileType: neighbors.topLeft.tileType })
        if ([top, topRight, right].every(x => x === payload.tileType))
            foundAvailableMonumentLocations.push({ index: neighbors.top.index, tileType: neighbors.top.tileType })
        if ([right, bottomRight, bottom].every(x => x === payload.tileType))
            foundAvailableMonumentLocations.push({ index: payload.index, tileType: payload.tileType })
        if ([bottom, bottomLeft, left].every(x => x === payload.tileType))
            foundAvailableMonumentLocations.push({ index: neighbors.left.index, tileType: neighbors.left.tileType })

        if (foundAvailableMonumentLocations && foundAvailableMonumentLocations.length > 0) {
            commit('setAvailableMonumentLocations', foundAvailableMonumentLocations)
            commit('game/setActionType', { actionType: actionTypes.buildMonument }, { root: true })
        }
    },
    buildMonument({getters, commit, dispatch}, payload) {
        let target = getters.tile(payload.index)
        let targetNeighbors = getters.getNeighbors(target.index)
        commit('updateTile', {...target, tileType: tileTypes.monumentTopLeft })
        commit('updateTile', {...targetNeighbors.right, tileType: tileTypes.monumentTopRight })
        commit('updateTile', {...targetNeighbors.bottom, tileType: tileTypes.monumentBottomLeft })
        commit('updateTile', {
            ...targetNeighbors.bottomRight,
            tileType: tileTypes.monumentBottomRight,
            monumentType: payload.monumentType
        })
        commit('resetAvailableMonumentLocations')
        commit('game/resetSelectedMonumentType', null, {root: true})
        dispatch('checkForDisplacedLeader')
        commit('game/setActionType', { actionType: actionTypes.playTile }, { root: true })
        commit('game/actionCompleted', null, {root: true})
    },
    checkForMonumentScore({getters, rootGetters, commit}) {
        let playerId = rootGetters['game/currentActionPlayerId']
        let kingdoms = getters.kingdoms
        kingdoms.forEach(kingdom => {
            let playerLeaders = []
            let monuments = []
            kingdom.tileIndexes.forEach(index => {
                let tile = getters.tiles[index]
                if (tile.isLeaderTile && tile.playerId === playerId)
                    playerLeaders.push(tile.tileType)
                if (tile.monumentType)
                    monuments.push(tile.monumentType)
            })
            if (playerLeaders.length > 0 && monuments.length > 0) {
                monuments.forEach(monument => {
                    if (monumentTypes.redMonuments.includes(monument) && playerLeaders.includes(tileTypes.priest))
                        commit('players/incrementScore', { playerId: playerId, tileType: tileTypes.temple }, { root: true })
                    if (monumentTypes.blueMonuments.includes(monument) && playerLeaders.includes(tileTypes.farmer))
                        commit('players/incrementScore', { playerId: playerId, tileType: tileTypes.farm }, { root: true })
                    if (monumentTypes.greenMonuments.includes(monument) && playerLeaders.includes(tileTypes.trader))
                        commit('players/incrementScore', { playerId: playerId, tileType: tileTypes.market }, { root: true })
                    if (monumentTypes.blackMonuments.includes(monument) && playerLeaders.includes(tileTypes.king))
                        commit('players/incrementScore', { playerId: playerId, tileType: tileTypes.settlement }, { root: true })
                })
            }
        })
    },
    checkForDisplacedLeader({state, getters, commit}) {
        for (let i = 0; i < state.tiles.length; i++) {
            let tile = state.tiles[i]
            if (tile.isLeaderTile) {
                let neighbors = getters.getNeighbors(i)
                let hasTemple = false
                if (neighbors.bottom.tileType == tileTypes.temple || neighbors.bottom.tileType == tileTypes.treasure) hasTemple = true
                if (neighbors.left.tileType == tileTypes.temple || neighbors.left.tileType == tileTypes.treasure) hasTemple = true
                if (neighbors.right.tileType == tileTypes.temple || neighbors.right.tileType == tileTypes.treasure) hasTemple = true
                if (neighbors.top.tileType == tileTypes.temple || neighbors.top.tileType == tileTypes.treasure) hasTemple = true
                if (!hasTemple) {
                    commit('players/addLeaderToPlayer', tile, {root: true})
                    commit('removeTile', { index: tile.index })
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
                playerId: payload?.playerId ?? 0,
                monumentType: payload?.monumentType
            }
            state.tiles.splice(payload.index, 1, tile)
        }
    },
    removeTile(state, payload) {
        let newTile = {
            index: payload.index,
            tileType: tileTypes.empty,
            isLeaderTile: false,
            playerId: 0,
            monumentType: null
        }
        state.tiles.splice(payload.index, 1, newTile)
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
    },
    setAvailableMonumentLocations(state, payload) {
        if (payload) {
            Vue.set(state, 'availableMonumentLocations', payload)
        }
    },
    resetAvailableMonumentLocations(state) {
        state.availableMonumentLocations.splice(0)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}