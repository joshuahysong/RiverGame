import Vue from 'vue';
import { mapTypes, tileTypes, boardStats, actionTypes, monumentTypes, conflictTypes } from '../../common/constants'
import helpers from '../../common/helpers'

const state = () => ({
    map: [
        0,0,0,0,1,1,1,1,1,0,2,0,1,0,0,0,
        0,2,0,0,1,0,0,0,0,0,0,0,1,0,0,2,
        0,0,0,1,1,2,0,0,0,0,0,0,1,1,0,0,
        1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,
        0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
        1,1,1,1,0,0,0,0,2,0,0,0,1,1,1,0,
        0,2,0,1,1,1,1,0,0,0,0,0,1,0,0,0,
        0,0,0,0,0,0,1,1,1,1,1,1,1,0,2,0,
        0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0
    ],
    tiles: [],
    regions: [],
    availableTileLocations: [],
    availableMonumentLocations: [],
    initialTreasures: 0,
    remainingTreasures: 0,
    treasuresToTake: 0,
    conflictTile: null,
    leaderGroupsAtWar: []
})

const riverPath = [
    ' ',' ',' ',' ','╔','=','=','=','╝',' ',' ',' ','║',' ',' ',' ',
    ' ',' ',' ',' ','║',' ',' ',' ',' ',' ',' ',' ','║',' ',' ',' ',
    ' ',' ',' ','╔','╝',' ',' ',' ',' ',' ',' ',' ','╚','╗',' ',' ',
    '=','=','=','╝',' ',' ',' ',' ',' ',' ',' ',' ',' ','╚','=','╗',
    ' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','╔','╝',
    ' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','║',' ',
    '=','=','=','╗',' ',' ',' ',' ',' ',' ',' ',' ','╔','=','╝',' ',
    ' ',' ',' ','╚','=','=','╗',' ',' ',' ',' ',' ','║',' ',' ',' ',
    ' ',' ',' ',' ',' ',' ','╚','=','=','=','=','=','╝',' ',' ',' ',
    ' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',
    ' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '
]

const getters = {
    map: (state) => {
        return state.map
    },
    getRiverPath: () => (index) => {
        if (!riverPath && index < riverPath.length) return null
        return riverPath[index]
    },
    tiles: (state) => {
        return state.tiles
    },
    tile: (state) => (index) => {
        return state.tiles[index]
    },
    regions: (state) => {
        return state.regions
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
            if (state.regions[i].tileIndexes.includes(index)) {
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
    conflictTile: (state) => {
        return state.conflictTile
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
    },
    getWarBoardStrength: (state, getters) => (leader) => {
        let boardStrength = []
        if (!leader) return boardStrength
        let leaderRegion = getters.getRegion(leader.index)
        if (!leaderRegion || !leaderRegion?.tileIndexes) return boardStrength
        for (const tileIndex of leaderRegion.tileIndexes) {
            const tile = getters.tile(tileIndex)
            if (leader.tileType === tileTypes.priest && tile.tileType === tileTypes.temple)
                boardStrength.push({ ...tile })
            if (leader.tileType === tileTypes.king && tile.tileType === tileTypes.settlement)
                boardStrength.push({ ...tile })
            if (leader.tileType === tileTypes.trader && tile.tileType === tileTypes.market)
                boardStrength.push({ ...tile })
            if (leader.tileType === tileTypes.farmer && tile.tileType === tileTypes.farm)
                boardStrength.push({ ...tile })
        }
        return boardStrength
    },
    leaderGroupsAtWar: (state) => {
        return state.leaderGroupsAtWar
    }
}

const actions = {
    init ({state, commit, dispatch}) {
        commit('resetAvailableTileLocations')
        let newTiles = []
        for (let i = 0; i < state.map.length; i++) {
            const tileType = state.map[i] === mapTypes.treasure ||
                    state.map[i] === mapTypes.priorityTreasure
                ? tileTypes.temple
                : tileTypes.empty
            newTiles.push({
                index: i,
                tileType: tileType,
                isLeaderTile: false,
                hasTreasure: tileType === tileTypes.temple,
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
                commit('players/clearTileSelection', currentPlayer.id, { root: true })
                commit('updateTile', { ...clickedTile, isHighlighted: !clickedTile.isHighlighted })
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
                commit('addTile', newTile)
                dispatch('players/removeSelectedTiles', currentPlayer.id, { root: true })
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

                dispatch('checkForDisplacedLeader')
                dispatch('checkForWar', { ...newTile })
                if (rootGetters['game/currentActionType'] !== actionTypes.playTile) return

                const neighborKingdoms = getters.neighborRegions(newTile).filter(x => x.isKingdom)
                dispatch('setRegions')
                if (neighborKingdoms.length <= 1 && playerHasSelectedTiles) dispatch('checkForTileScore', newTile)
                dispatch('checkForRevolt', newTile)
                if (rootGetters['game/currentActionType'] !== actionTypes.playTile) return

                dispatch('checkForMonument', newTile)
                if (rootGetters['game/currentActionType'] !== actionTypes.playTile) return

                commit('game/actionCompleted', null, { root: true })
                dispatch('checkForTreasureToTake')
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

                dispatch('checkForTreasureToTake')
                if (getters.treasuresToTake < 1) {
                    commit('game/setCurrentActionPlayerId', rootGetters['game/activeTurnPlayerId'], { root: true })
                    commit('game/setActionType', actionTypes.playTile, { root: true })
                }
            }
        }
        if (currentActionType === actionTypes.buildMonumentMultiple) {
            let monumentType = rootGetters['game/selectedMonumentType']
            dispatch('buildMonument', { ...clickedTile, monumentType: monumentType })
        }
        if (currentActionType === actionTypes.warChooseLeader) {
            if (clickedTile.isHighlighted &&
                clickedTile.isLeaderTile &&
                getters.leaderGroupsAtWar.length > 0
            ) {
                const chosenLeaderGroup = getters.leaderGroupsAtWar.filter(x => x[0].tileType === clickedTile.tileType)
                if (chosenLeaderGroup && chosenLeaderGroup.length > 0)
                dispatch('triggerWar', { attacker: chosenLeaderGroup[0][0], defender: chosenLeaderGroup[0][1] })
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
                    const hasTempleNeighbor = (neighbors.left && neighbors.left.tileType === tileTypes.temple) ||
                        (neighbors.top && neighbors.top.tileType === tileTypes.temple) ||
                        (neighbors.bottom && neighbors.bottom.tileType === tileTypes.temple) ||
                        (neighbors.right && neighbors.right.tileType === tileTypes.temple)
                    if (!isJoiningKingdoms &&
                        hasTempleNeighbor &&
                        mapSquareTile.tileType == tileTypes.empty &&
                        mapSquare !== mapTypes.river) {
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
                        ((mapSquare === mapTypes.river && selectedTile.tileType === tileTypes.farm) ||
                         (mapSquare !== mapTypes.river && selectedTile.tileType !== tileTypes.farm)))
                        eligibleTileLocations.push(i)
                }
            }
        }
        commit('setAvailableTileLocations', eligibleTileLocations)
    },
    setRegions({state, getters, commit}) {
        commit('resetRegions')
        let indexesToCheck = [...state.tiles
            .filter(x => x.tileType !== tileTypes.empty &&
                x.tileType !== tileTypes.catastrophe &&
                (!getters.conflictTile || getters.conflictTile.index !== x.index))
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
    checkForTreasureToTake({getters, commit}) {
        for (const region of getters.regions) {
            let tilesWithTreasure = []
            if (region && region.isKingdom) {
                let matchingTrader = null
                for (let i = 0; i < region.tileIndexes.length; i++) {
                    let matchingTile = getters.tile(region.tileIndexes[i])
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
                    commit('game/setCurrentActionPlayerId', matchingTrader.playerId, { root: true })
                    commit('game/setActionType', actionTypes.takeTreasure, { root: true })
                }
            }
            commit('setTreasuresToTake', tilesWithTreasure.length - 1)
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
            commit('game/setActionType', actionTypes.buildMonument, { root: true })
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
        commit('game/removeFromRemainingMonuments', payload.monumentType, { root: true })
        commit('resetAvailableMonumentLocations')
        commit('game/resetSelectedMonumentType', null, { root: true })

        commit('log/logActionMessage', {
            playerId: rootGetters['game/currentActionPlayerId'],
            text: `built ${helpers.getMonumentNameByType(payload.monumentType)} monument at ${helpers.getCoordinatesByIndex(payload.index)}`
        }, { root: true })

        dispatch('checkForDisplacedLeader')
        dispatch('setRegions')
        commit('game/setActionType', actionTypes.playTile, { root: true })
        commit('game/actionCompleted', null, { root: true })
        dispatch('checkForTreasureToTake')
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
        if (!tile || !tile.isLeaderTile) return
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
                commit('game/resetConflictData', null, { root: true })
                commit('game/setCurrentActionPlayerId', tile.playerId, { root: true })
                commit('game/setConflictAttackerLeader', tile, { root: true })
                commit('game/setConflictDefenderLeader', matchingDefenderLeader, { root: true })
                commit('game/setConflictAttackerBoardTiles', getters.getRevoltBoardStrength(tile), { root: true })
                commit('game/setConflictDefenderBoardTiles', getters.getRevoltBoardStrength(matchingDefenderLeader), { root: true })
                commit('game/setConflictTileType', tileTypes.temple, { root: true })
                commit('game/setActionType', actionTypes.conflictAttack, { root: true })
                commit('game/setConflictType', conflictTypes.revolt, { root: true })
                commit('log/logActionMessage', {
                    text: `A Revolt has begun between ${helpers.getLogToken(tile)}
                        and ${helpers.getLogToken(matchingDefenderLeader)}`
                }, { root: true })
            }
        }
    },
    checkForWar({getters, commit, dispatch}, tile) {
        if (!tile || tile.isLeaderTile || tile.tileType === tileTypes.catastrophe) return
        if (!getters.conflictTile) commit('setConflictTile', tile)
        commit('resetLeaderGroupsAtWar')
        let redLeaders = []
        let blackLeaders = []
        let greenLeaders = []
        let blueLeaders = []
        const neighborKingdoms = getters.neighborRegions(tile).filter(x => x.isKingdom)
        for (const neighborKingdom of neighborKingdoms) {
            for (const tileIndex of neighborKingdom.tileIndexes) {
                const tile = getters.tile(tileIndex)
                if (!tile.isLeaderTile) continue
                if (tile.tileType === tileTypes.priest) redLeaders.push({ ...tile })
                if (tile.tileType === tileTypes.king) blackLeaders.push({ ...tile })
                if (tile.tileType === tileTypes.trader) greenLeaders.push({ ...tile })
                if (tile.tileType === tileTypes.farmer) blueLeaders.push({ ...tile })
            }
        }
        let leaderGroups = [redLeaders, blackLeaders, greenLeaders, blueLeaders]
        let leaderGroupsAtWar = []
        // Find which groups have more than one leader to trigger a war
        for (const leaderGroup of leaderGroups) {
            if (leaderGroup.length >= 2) {
                leaderGroup.sort((a, b) => {
                    if (a.playerId === tile.playerId && b.playerId !== tile.playerId) return -1
                    if (a.playerId !== tile.playerId && b.playerId === tile.playerId) return 1
                    return a.playerId - b.playerId
                })
                leaderGroupsAtWar.push(leaderGroup)
                for (const leader of leaderGroup) {
                    commit('updateTile', { ...leader, isHighlighted: true })
                }
            }
        }

        if (leaderGroupsAtWar.length == 0) {
            commit('resetConflictTile')
        // if there is more than one group the active player has to choose who fights
        } else if (leaderGroupsAtWar.length > 1) {
            commit('setLeaderGroupsAtWar', leaderGroupsAtWar)
            commit('game/setActionType', actionTypes.warChooseLeader, { root: true })
        // if only one group then trigger a war immediately
        } else if (leaderGroupsAtWar.length === 1) {
            dispatch('triggerWar', { attacker: leaderGroupsAtWar[0][0], defender: leaderGroupsAtWar[0][1] })
        }
    },
    triggerWar({commit, getters}, payload) {
        if (!payload || !payload.attacker || !payload.defender) return
        commit('game/resetConflictData', null, { root: true })
        if (payload.attacker.tileType === tileTypes.priest) commit('game/setConflictTileType', tileTypes.temple, { root: true })
        if (payload.attacker.tileType === tileTypes.king) commit('game/setConflictTileType', tileTypes.settlement, { root: true })
        if (payload.attacker.tileType === tileTypes.trader) commit('game/setConflictTileType', tileTypes.market, { root: true })
        if (payload.attacker.tileType === tileTypes.farmer) commit('game/setConflictTileType', tileTypes.farm, { root: true })
        const attacker = { ...payload.attacker }
        const defender = { ...payload.defender }
        commit('updateTile', { ...attacker, isHighlighted: true })
        commit('updateTile', { ...defender, isHighlighted: true })
        commit('game/setCurrentActionPlayerId', attacker.playerId, { root: true })
        commit('game/setCurrentHandDisplayPlayerId', attacker.playerId, { root: true })
        commit('game/setConflictAttackerLeader', attacker, { root: true })
        commit('game/setConflictDefenderLeader', defender, {root: true })
        commit('game/setConflictAttackerBoardTiles', getters.getWarBoardStrength(attacker), { root: true })
        commit('game/setConflictDefenderBoardTiles', getters.getWarBoardStrength(defender), {root: true })
        commit('game/setActionType', actionTypes.conflictAttack, { root: true })
        commit('game/setConflictType', conflictTypes.war, { root: true })
        commit('game/setConflictWinnerPlayerId', 0, { root: true })
        commit('log/logActionMessage', {
            text: `A War has begun between ${helpers.getLogToken(attacker)}
                and ${helpers.getLogToken(defender)}`
        }, { root: true })
    }
}

const mutations = {
    setTreasureCounts(state) {
        const initialTreasureCount = state.map.filter(x => x === mapTypes.treasure || x === mapTypes.priorityTreasure).length
        state.initialTreasures = initialTreasureCount
        state.remainingTreasures = initialTreasureCount
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
    },
    setConflictTile(state, tile) {
        state.conflictTile = { ...tile }
    },
    resetConflictTile(state) {
        state.conflictTile = null
    },
    setLeaderGroupsAtWar(state, payload) {
        state.leaderGroupsAtWar = [...payload]
    },
    resetLeaderGroupsAtWar(state) {
        state.leaderGroupsAtWar = []
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}