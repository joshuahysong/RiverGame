import Vue from 'vue';
import { mapTypes, tileTypes, boardStats, actionTypes, monumentTypes } from '../../common/constants'
import helpers from '../../common/helpers'

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
    availableMonumentLocations: [],
    initialTreasures: 0,
    remainingTreasures: 0,
    treasuresToTake: 0
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
    initialTreasures: (state) => {
        return state.initialTreasures
    },
    remainingTreasures: (state) => {
        return state.remainingTreasures
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
    },
    isValidTileLocation: (state, getters) => (index) => {
        let availableTileLocations = getters.getAvailableTileLocations
        return availableTileLocations && availableTileLocations.some(x => x === index)
    },
    selectedBoardLeader: (state, getters) => (playerId) => {
        return getters.tiles.filter(tile => tile.isLeaderTile && tile.playerId == playerId && tile.isHighlighted)[0]
    },
    treasuresToTake: (state) => {
        return state.treasuresToTake
    },
    getRevoltBoardStrength: (state, getters) => (leader) => {
        let boardStrength = []
        let leaderNeighbors = getters.getNeighbors(leader.index)
        if (leaderNeighbors.top && leaderNeighbors.top.tileType === tileTypes.temple)
            boardStrength.push({ ...leaderNeighbors.top })
        if (leaderNeighbors.right && leaderNeighbors.right.tileType === tileTypes.temple)
            boardStrength.push({ ...leaderNeighbors.right })
        if (leaderNeighbors.bottom && leaderNeighbors.bottom.tileType === tileTypes.temple)
            boardStrength.push({ ...leaderNeighbors.bottom })
        if (leaderNeighbors.left && leaderNeighbors.left.tileType === tileTypes.temple)
            boardStrength.push({ ...leaderNeighbors.left })
        return boardStrength
    }
}

const actions = {
    init ({commit, dispatch}) {
        commit('resetAvailableTileLocations')
        let newTiles = []
        for (let i = 0; i < initialTiles.length; i++) {
            newTiles.push({
                index: i,
                tileType: initialTiles[i],
                isLeaderTile: false,
                hasTreasure: initialTiles[i] === tileTypes.temple,
                playerId: 0
            })
        }
        commit('setTiles', newTiles)
        dispatch('setRegions')
        commit('setTreasureCounts')
    },
    handleBoardClick ({commit, rootGetters, dispatch, getters}, clickedTile) {
        if (!clickedTile) return
        let currentActionType = rootGetters['game/currentActionType']
        if (currentActionType === actionTypes.playTile) {
            let currentPlayer = rootGetters['players/currentPlayer']
            let selectedBoardLeader = getters.selectedBoardLeader(currentPlayer.id)
            let playerHasSelectedTiles = currentPlayer.selectedTiles && currentPlayer.selectedTiles.length >= 1

            // Select/Deselect player leader tile
            if (clickedTile.isLeaderTile &&
                clickedTile.playerId === currentPlayer.id &&
                rootGetters['game/remainingActions'] > 0
            ) {
                commit('players/clearTileSelection', { playerId: currentPlayer.id }, { root: true })
                commit('updateTile', {...clickedTile, isHighlighted: !clickedTile.isHighlighted})
                let selectedLeaderTile = getters.tile(clickedTile.index)
                if (selectedLeaderTile.isHighlighted) {
                    dispatch('calculateAvailableTileLocations', selectedLeaderTile)
                } else {
                    commit('resetAvailableTileLocations')
                }
            // Place a tile
            } else if ((playerHasSelectedTiles || selectedBoardLeader) &&
                getters.isValidTileLocation(clickedTile.index)
            ) {
                dispatch('game/saveSnapshot', null, { root: true })
                if (selectedBoardLeader) commit('removeTile', { index: selectedBoardLeader.index })
                const selectedTile = playerHasSelectedTiles ? currentPlayer.selectedTiles[0] : selectedBoardLeader
                const newTile = {
                    ...clickedTile,
                    isLeaderTile: selectedTile.isLeaderTile,
                    tileType: selectedTile.tileType,
                    playerId: currentPlayer.id
                }
                const neighborKingdoms = getters.neighborRegions(newTile).filter(x => x.isKingdom)
                commit('addTile', newTile)
                dispatch('setRegions')
                if (neighborKingdoms.length <= 1 && playerHasSelectedTiles) dispatch('checkForTileScore', newTile)
                dispatch('players/removeSelectedTiles', { playerId: currentPlayer.id }, { root: true })
                commit('resetAvailableTileLocations')

                if (selectedBoardLeader) {
                    commit('log/logActionMessage', {
                        playerId: currentPlayer.id,
                        text: `moved ${helpers.getLogToken(newTile)}
                            from ${helpers.getCoordinatesByIndex(selectedBoardLeader.index)}
                            to ${helpers.getCoordinatesByIndex(newTile.index)}`
                    }, { root: true })
                } else {
                    commit('log/logActionMessage', {
                        playerId: currentPlayer.id,
                        text: `placed ${helpers.getLogToken(newTile)}
                            on ${helpers.getCoordinatesByIndex(newTile.index)}`
                    }, { root: true })
                }

                dispatch('checkForRevolt', newTile)
                dispatch('checkForMonument', newTile)

                if (rootGetters['game/currentActionType'] === actionTypes.playTile) {
                    commit('game/actionCompleted', null, { root: true })
                    dispatch('checkForTreasureToTake', newTile)
                }
            }
        }
        if (currentActionType === actionTypes.takeTreasure) {
            if (clickedTile.isHighlighted) {
                commit('removeTreasure')
                commit('players/incrementScore', { playerId: rootGetters['game/currentActionPlayerId'], scoreName: 'treasure' }, { root: true })
                commit('updateTile', { ...clickedTile, hasTreasure: false, isHighlighted: false })
                commit('resetBoardTileHighlights')
                commit('log/logActionMessage', {
                    playerId: rootGetters['game/currentActionPlayerId'],
                    text: `retreived a {treasure} from ${helpers.getCoordinatesByIndex(clickedTile.index)}`
                }, { root: true })

                dispatch('checkForTreasureToTake', clickedTile)
                if (getters.treasuresToTake < 1) {
                    commit('game/setCurrentActionPlayerId', { playerId: rootGetters['game/activeTurnPlayerId'] }, { root: true })
                    commit('game/setActionType', { actionType: actionTypes.playTile }, { root: true })
                }
            }
        }
        if (currentActionType === actionTypes.buildMonumentMultiple) {
            let monumentType = rootGetters['game/selectedMonumentType']
            dispatch('buildMonument', { ...clickedTile, monumentType: monumentType })
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
                    const hasTempleNeighbor = (neighbors.left && neighbors.left.tileType === tileTypes.temple) ||
                        (neighbors.top && neighbors.top.tileType === tileTypes.temple) ||
                        (neighbors.bottom && neighbors.bottom.tileType === tileTypes.temple) ||
                        (neighbors.right && neighbors.right.tileType === tileTypes.temple)
                    if (!isJoiningKingdoms &&
                        hasTempleNeighbor &&
                        mapSquareTile.tileType == tileTypes.empty &&
                        mapSquare === mapTypes.ground) {
                            eligibleTileLocations.push(i)
                        }
                } else if (selectedTile.tileType === tileTypes.catastrophe) {
                    if (!mapSquareTile.hasTreasure &&
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
                    commit('players/incrementScore', {
                        playerId: matchingLeader.playerId,
                        scoreName: helpers.getTileNameByType(payload.tileType)
                    }, { root: true })
                } else if (matchingKing !== null) {
                    commit('players/incrementScore', {
                        playerId: matchingKing.playerId,
                        scoreName: helpers.getTileNameByType(payload.tileType)
                    }, { root: true })
                }
            }
        }
    },
    checkForTreasureToTake({state, getters, commit}, payload) {
        let tilesWithTreasure = []
        let region = getters.getRegion(payload.index)
        if (region && region.isKingdom) {
            let matchingTrader = null
            for (let i = 0; i < region.tileIndexes.length; i++) {
                let matchingTile = state.tiles[region.tileIndexes[i]]
                if (matchingTile) {
                    if (matchingTile.hasTreasure)
                        tilesWithTreasure.push(matchingTile)
                    if (matchingTile.tileType === tileTypes.trader) {
                        matchingTrader = matchingTile
                    }
                }
            }
            if (tilesWithTreasure.length > 1 && matchingTrader !== null) {
                for (let i = 0; i < tilesWithTreasure.length; i++) {
                    commit('updateTile', { ...tilesWithTreasure[i], isHighlighted: true })
                }
                commit('game/setCurrentActionPlayerId', {playerId: matchingTrader.playerId}, {root: true})
                commit('game/setActionType', {actionType: actionTypes.takeTreasure}, {root: true})
            }
        }
        commit('setTreasuresToTake', tilesWithTreasure.length - 1)
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
    buildMonument({getters, commit, dispatch, rootGetters}, payload) {
        let target = getters.tile(payload.index)
        let targetNeighbors = getters.getNeighbors(target.index)
        commit('updateTile', { ...target, tileType: tileTypes.monumentTopLeft })
        commit('updateTile', { ...targetNeighbors.right, tileType: tileTypes.monumentTopRight })
        commit('updateTile', { ...targetNeighbors.bottom, tileType: tileTypes.monumentBottomLeft })
        commit('updateTile', {
            ...targetNeighbors.bottomRight,
            tileType: tileTypes.monumentBottomRight,
            monumentType: payload.monumentType
        })
        getters.availableMonumentLocations.forEach(location => {
            let tile = getters.tile(location.index)
            commit('updateTile', { ...tile, isHighlighted: false })
        })
        commit('game/removeFromRemainingMonuments', payload, { root: true })
        commit('resetAvailableMonumentLocations')
        commit('game/resetSelectedMonumentType', null, { root: true })

        commit('log/logActionMessage', {
            playerId: rootGetters['game/currentActionPlayerId'],
            text: `built ${helpers.getMonumentNameByType(payload.monumentType)} monument at ${helpers.getCoordinatesByIndex(payload.index)}`
        }, { root: true })

        dispatch('checkForDisplacedLeader')
        dispatch('setRegions')
        commit('game/setActionType', { actionType: actionTypes.playTile }, { root: true })
        commit('game/actionCompleted', null, { root: true })
        dispatch('checkForTreasureToTake', target)
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
                        commit('players/incrementScore', { playerId: playerId, scoreName: helpers.getTileNameByType(tileTypes.temple) }, { root: true })
                    if (monumentTypes.blueMonuments.includes(monument) && playerLeaders.includes(tileTypes.farmer))
                        commit('players/incrementScore', { playerId: playerId, scoreName: helpers.getTileNameByType(tileTypes.farm) }, { root: true })
                    if (monumentTypes.greenMonuments.includes(monument) && playerLeaders.includes(tileTypes.trader))
                        commit('players/incrementScore', { playerId: playerId, scoreName: helpers.getTileNameByType(tileTypes.market) }, { root: true })
                    if (monumentTypes.blackMonuments.includes(monument) && playerLeaders.includes(tileTypes.king))
                        commit('players/incrementScore', { playerId: playerId, scoreName: helpers.getTileNameByType(tileTypes.settlement) }, { root: true })
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
                if (neighbors.bottom && neighbors.bottom.tileType == tileTypes.temple) hasTemple = true
                if (neighbors.left && neighbors.left.tileType == tileTypes.temple) hasTemple = true
                if (neighbors.right && neighbors.right.tileType == tileTypes.temple) hasTemple = true
                if (neighbors.top && neighbors.top.tileType == tileTypes.temple) hasTemple = true
                if (!hasTemple) {
                    commit('players/addLeaderToPlayer', tile, { root: true })
                    commit('removeTile', { index: tile.index })
                }
            }
        }
    },
    checkForRevolt({state, getters, commit}, tile) {
        if (tile && tile.isLeaderTile) {
            const region = getters.getRegion(tile.index)
            if (region && region.isKingdom) {
                let matchingDefenderLeader = null
                for (let i = 0; i < region.tileIndexes.length; i++) {
                    var matchingTile = state.tiles[region.tileIndexes[i]]
                    if (matchingTile &&
                        matchingTile.isLeaderTile &&
                        matchingTile.tileType === tile.tileType &&
                        matchingTile.playerId !== tile.playerId) {
                            matchingDefenderLeader = { ...matchingTile }
                            break
                    }
                }
                if (matchingDefenderLeader) {
                    commit('updateTile', { ...tile, isHighlighted: true })
                    commit('updateTile', { ...matchingDefenderLeader, isHighlighted: true })
                    commit('game/setCurrentActionPlayerId', { playerId: tile.playerId }, { root: true })
                    commit('game/setConflictAttackerLeader', { ...tile }, { root: true })
                    commit('game/setConflictDefenderLeader', { ...matchingDefenderLeader }, {root: true })
                    commit('game/setActionType', { actionType: actionTypes.revoltAttack }, { root: true })
                    commit('log/logActionMessage', {
                        text: `A Revolt has begun between ${helpers.getLogToken(tile)}
                            and ${helpers.getLogToken(matchingDefenderLeader)}`
                    }, { root: true })
                }
            }
        }
    }
}

const mutations = {
    setTreasureCounts(state) {
        state.initialTreasures = initialTiles.filter(x => x === tileTypes.temple).length
        state.remainingTreasures = state.tiles.filter(x => x.hasTreasure).length
    },
    removeTreasure(state) {
        state.remainingTreasures--
    },
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
    },
    resetBoardTileHighlights(state) {
        state.tiles.forEach(tile => tile.isHighlighted = false)
    },
    setTreasuresToTake(state, payload) {
        state.treasuresToTake = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}