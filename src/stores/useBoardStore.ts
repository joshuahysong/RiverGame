import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  mapTypes,
  tileTypes,
  boardStats,
  actionTypes,
  monumentTypes,
  conflictTypes,
} from '@/common/constants'
import helpers from '@/common/helpers'
import { useGameStore } from './useGameStore'
import { usePlayersStore } from './usePlayersStore'
import { useLogStore } from './useLogStore'

interface BoardTile {
  index: number
  tileType: number
  isLeaderTile: boolean
  hasTreasure?: boolean
  playerId?: number
  isHighlighted?: boolean
  monumentType?: number
}

interface Region {
  regionIndex: number
  tileIndexes: number[]
  isKingdom: boolean
}

interface Neighbors {
  top?: BoardTile
  topRight?: BoardTile
  right?: BoardTile
  bottomRight?: BoardTile
  bottom?: BoardTile
  bottomLeft?: BoardTile
  left?: BoardTile
  topLeft?: BoardTile
}

const riverPath = [
  ' ',
  ' ',
  ' ',
  ' ',
  '╔',
  '=',
  '=',
  '=',
  '╝',
  ' ',
  ' ',
  ' ',
  '║',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  '║',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  '║',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  '╔',
  '╝',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  '╚',
  '╗',
  ' ',
  ' ',
  '=',
  '=',
  '=',
  '╝',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  '╚',
  '=',
  '╗',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  '╔',
  '╝',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  '║',
  ' ',
  '=',
  '=',
  '=',
  '╗',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  '╔',
  '=',
  '╝',
  ' ',
  ' ',
  ' ',
  ' ',
  '╚',
  '=',
  '=',
  '╗',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  '║',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  '╚',
  '=',
  '=',
  '=',
  '=',
  '=',
  '╝',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
  ' ',
]

export const useBoardStore = defineStore('board', () => {
  // State
  const map = ref<number[]>([
    0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 2, 0, 1, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3,
    0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    1, 1, 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 1, 1, 1, 0, 0, 3, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 3, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0,
  ])
  const tiles = ref<BoardTile[]>([])
  const regions = ref<Region[]>([])
  const availableTileLocations = ref<number[]>([])
  const availableMonumentLocations = ref<any[]>([])
  const initialTreasures = ref(0)
  const remainingTreasures = ref(0)
  const treasuresToTake = ref(0)
  const conflictTile = ref<BoardTile | null>(null)
  const leaderGroupsAtWar = ref<BoardTile[][]>([])

  // Getters
  const getMap = () => map.value
  const getRiverPath = (index: number) => {
    if (!riverPath || index >= riverPath.length) return null
    return riverPath[index]
  }
  const getTiles = () => tiles.value
  const getTile = (index: number) => tiles.value[index]
  const getRegions = () => regions.value
  const getInitialTreasures = () => initialTreasures.value
  const getRemainingTreasures = () => remainingTreasures.value
  const getKingdoms = () => regions.value.filter((region) => region.isKingdom)
  const getAvailableTileLocations = () => availableTileLocations.value
  const getAvailableMonumentLocations = () => availableMonumentLocations.value

  const getNeighbors = (index: number): Neighbors => {
    if (tiles.value.length === 0) return {}

    const neighbors: Neighbors = {}

    // top left corner
    if (index === 0) {
      neighbors.right = tiles.value[1]
      neighbors.bottomRight = tiles.value[index + boardStats.columns + 1]
      neighbors.bottom = tiles.value[index + boardStats.columns]
    }
    // top edge
    else if (index < boardStats.columns - 1) {
      neighbors.right = tiles.value[index + 1]
      neighbors.bottomRight = tiles.value[index + boardStats.columns + 1]
      neighbors.bottom = tiles.value[index + boardStats.columns]
      neighbors.bottomLeft = tiles.value[index + boardStats.columns - 1]
      neighbors.left = tiles.value[index - 1]
    }
    // top right corner
    else if (index === boardStats.columns - 1) {
      neighbors.bottom = tiles.value[index + boardStats.columns]
      neighbors.bottomLeft = tiles.value[index + boardStats.columns - 1]
      neighbors.left = tiles.value[index - 1]
    }
    // bottom left corner
    else if (index === boardStats.columns * (boardStats.rows - 1)) {
      neighbors.top = tiles.value[index - boardStats.columns]
      neighbors.topRight = tiles.value[index - boardStats.columns + 1]
      neighbors.right = tiles.value[index + 1]
    }
    // left edge
    else if (index > boardStats.columns - 1 && index % boardStats.columns === 0) {
      neighbors.top = tiles.value[index - boardStats.columns]
      neighbors.topRight = tiles.value[index - boardStats.columns + 1]
      neighbors.right = tiles.value[index + 1]
      neighbors.bottomRight = tiles.value[index + boardStats.columns + 1]
      neighbors.bottom = tiles.value[index + boardStats.columns]
    }
    // bottom right corner
    else if (index === boardStats.columns * boardStats.rows - 1) {
      neighbors.top = tiles.value[index - boardStats.columns]
      neighbors.left = tiles.value[index - 1]
      neighbors.topLeft = tiles.value[index - boardStats.columns - 1]
    }
    // right edge
    else if (index % boardStats.columns === boardStats.columns - 1) {
      neighbors.top = tiles.value[index - boardStats.columns]
      neighbors.bottom = tiles.value[index + boardStats.columns]
      neighbors.bottomLeft = tiles.value[index + boardStats.columns - 1]
      neighbors.left = tiles.value[index - 1]
      neighbors.topLeft = tiles.value[index - boardStats.columns - 1]
    }
    // bottom edge
    else if (index > boardStats.columns * (boardStats.rows - 1)) {
      neighbors.top = tiles.value[index - boardStats.columns]
      neighbors.topRight = tiles.value[index - boardStats.columns + 1]
      neighbors.right = tiles.value[index + 1]
      neighbors.left = tiles.value[index - 1]
      neighbors.topLeft = tiles.value[index - boardStats.columns - 1]
    }
    // all other positions
    else {
      neighbors.top = tiles.value[index - boardStats.columns]
      neighbors.topRight = tiles.value[index - boardStats.columns + 1]
      neighbors.right = tiles.value[index + 1]
      neighbors.bottomRight = tiles.value[index + boardStats.columns + 1]
      neighbors.bottom = tiles.value[index + boardStats.columns]
      neighbors.bottomLeft = tiles.value[index + boardStats.columns - 1]
      neighbors.left = tiles.value[index - 1]
      neighbors.topLeft = tiles.value[index - boardStats.columns - 1]
    }

    return neighbors
  }

  const getRegion = (index: number): Region | null => {
    for (let i = 0; i < regions.value.length; i++) {
      if (regions.value[i].tileIndexes.includes(index)) {
        return regions.value[i]
      }
    }
    return null
  }

  const getKingdomIndex = (index: number): number | null => {
    const kingdoms = getKingdoms()
    return kingdoms ? kingdoms.findIndex((region) => region.tileIndexes.includes(index)) : null
  }

  const getSelectedBoardLeader = (playerId: number): BoardTile | undefined => {
    return tiles.value.filter(
      (tile) => tile.isLeaderTile && tile.playerId === playerId && tile.isHighlighted
    )[0]
  }

  const neighborRegions = (tile: BoardTile): Region[] => {
    const neighbors = getNeighbors(tile.index)
    const neighborRegionsList: Region[] = []

    if (
      neighbors.left &&
      neighbors.left.tileType !== tileTypes.empty &&
      neighbors.left.tileType !== tileTypes.catastrophe
    ) {
      const region = getRegion(neighbors.left.index)
      if (region) neighborRegionsList.push(region)
    }
    if (
      neighbors.top &&
      neighbors.top.tileType !== tileTypes.empty &&
      neighbors.top.tileType !== tileTypes.catastrophe
    ) {
      const region = getRegion(neighbors.top.index)
      if (region) neighborRegionsList.push(region)
    }
    if (
      neighbors.right &&
      neighbors.right.tileType !== tileTypes.empty &&
      neighbors.right.tileType !== tileTypes.catastrophe
    ) {
      const region = getRegion(neighbors.right.index)
      if (region) neighborRegionsList.push(region)
    }
    if (
      neighbors.bottom &&
      neighbors.bottom.tileType !== tileTypes.empty &&
      neighbors.bottom.tileType !== tileTypes.catastrophe
    ) {
      const region = getRegion(neighbors.bottom.index)
      if (region) neighborRegionsList.push(region)
    }

    return Array.from(new Map(neighborRegionsList.map((item) => [item.regionIndex, item])).values())
  }

  const isValidTileLocation = (index: number): boolean => {
    return availableTileLocations.value && availableTileLocations.value.some((x) => x === index)
  }

  const getRevoltBoardStrength = (leader: BoardTile): BoardTile[] => {
    const boardStrength: BoardTile[] = []
    const leaderNeighbors = getNeighbors(leader.index)
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

  const getWarBoardStrength = (leader: BoardTile | null): BoardTile[] => {
    const boardStrength: BoardTile[] = []
    if (!leader) return boardStrength
    const leaderRegion = getRegion(leader.index)
    if (!leaderRegion?.tileIndexes) return boardStrength
    for (const tileIndex of leaderRegion.tileIndexes) {
      const tile = getTile(tileIndex)
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
  }

  // Actions
  function init() {
    resetAvailableTileLocations()
    const newTiles: BoardTile[] = []
    for (let i = 0; i < map.value.length; i++) {
      const tileType =
        map.value[i] === mapTypes.treasure || map.value[i] === mapTypes.priorityTreasure
          ? tileTypes.temple
          : tileTypes.empty
      newTiles.push({
        index: i,
        tileType: tileType,
        isLeaderTile: false,
        hasTreasure: tileType === tileTypes.temple,
        playerId: 0,
      })
    }
    setTiles(newTiles)
    setRegions()
    setTreasureCounts()
  }

  function handleBoardClick(clickedTile: BoardTile) {
    if (!clickedTile) return
    const gameStore = useGameStore()
    const playersStore = usePlayersStore()
    const logStore = useLogStore()

    const currentActionType = gameStore.currentActionType

    if (currentActionType === actionTypes.playTile) {
      const currentPlayer = playersStore.currentPlayer
      if (!currentPlayer) return

      const selectedBoardLeader = getSelectedBoardLeader(currentPlayer.id)
      const playerHasSelectedTiles =
        currentPlayer.selectedTiles && currentPlayer.selectedTiles.length >= 1

      // Select/Deselect player leader tile
      if (
        clickedTile.isLeaderTile &&
        clickedTile.playerId === currentPlayer.id &&
        gameStore.remainingActions > 0
      ) {
        playersStore.clearTileSelection(currentPlayer.id)
        updateTile({ ...clickedTile, isHighlighted: !clickedTile.isHighlighted })
        const selectedLeaderTile = getTile(clickedTile.index)
        if (selectedLeaderTile?.isHighlighted) {
          calculateAvailableTileLocations(selectedLeaderTile)
        } else {
          resetAvailableTileLocations()
        }
      }
      // Place a tile
      else if (
        (playerHasSelectedTiles || selectedBoardLeader) &&
        isValidTileLocation(clickedTile.index)
      ) {
        gameStore.saveSnapshot()
        if (selectedBoardLeader) removeTile({ index: selectedBoardLeader.index })

        const selectedTile = playerHasSelectedTiles
          ? currentPlayer.selectedTiles[0]
          : selectedBoardLeader
        const newTile: BoardTile = {
          ...clickedTile,
          isLeaderTile: selectedTile.isLeaderTile,
          tileType: selectedTile.tileType,
          playerId: currentPlayer.id,
        }

        addTile(newTile)
        playersStore.removeSelectedTiles(currentPlayer.id)
        resetAvailableTileLocations()

        if (selectedBoardLeader) {
          logStore.logActionMessage({
            playerId: currentPlayer.id,
            text: `moved ${helpers.getLogToken(newTile)}
              from ${helpers.getCoordinatesByIndex(selectedBoardLeader.index)}
              to ${helpers.getCoordinatesByIndex(newTile.index)}`,
          })
        } else {
          logStore.logActionMessage({
            playerId: currentPlayer.id,
            text: `placed ${helpers.getLogToken(newTile)}
              on ${helpers.getCoordinatesByIndex(newTile.index)}`,
          })
        }

        checkForDisplacedLeader()
        checkForWar({ ...newTile })
        if (gameStore.currentActionType !== actionTypes.playTile) return

        const neighborKingdoms = neighborRegions(newTile).filter((x) => x.isKingdom)
        setRegions()
        if (neighborKingdoms.length <= 1 && playerHasSelectedTiles) checkForTileScore(newTile)
        checkForRevolt(newTile)
        if (gameStore.currentActionType !== actionTypes.playTile) return

        checkForMonument(newTile)
        if (gameStore.currentActionType !== actionTypes.playTile) return

        gameStore.actionCompleted()
        checkForTreasureToTake()
      }
    }

    if (currentActionType === actionTypes.takeTreasure) {
      if (clickedTile.isHighlighted) {
        takeTreasure(clickedTile)
      }
    }

    if (currentActionType === actionTypes.buildMonumentMultiple) {
      const monumentType = gameStore.selectedMonumentType
      buildMonument({ ...clickedTile, monumentType: monumentType })
    }

    if (currentActionType === actionTypes.conflictChooseLeader) {
      if (
        clickedTile.isHighlighted &&
        clickedTile.isLeaderTile &&
        leaderGroupsAtWar.value.length > 0
      ) {
        const chosenLeaderGroup = leaderGroupsAtWar.value.filter(
          (x) => x[0].tileType === clickedTile.tileType
        )
        if (chosenLeaderGroup && chosenLeaderGroup.length > 0)
          triggerWar({ attacker: chosenLeaderGroup[0][0], defender: chosenLeaderGroup[0][1] })
      }
    }
  }

  function calculateAvailableTileLocations(selectedTile: BoardTile) {
    const eligibleTileLocations: number[] = []

    for (let i = 0; i < tiles.value.length; i++) {
      const mapSquare = map.value[i]
      const mapSquareTile = tiles.value[i]

      if (mapSquareTile) {
        if (selectedTile.isLeaderTile) {
          const neighboringRegions = neighborRegions(mapSquareTile)
          const isJoiningKingdoms =
            neighboringRegions.filter((region) => region.isKingdom).length > 1
          const neighbors = getNeighbors(i)
          const hasTempleNeighbor =
            (neighbors.left && neighbors.left.tileType === tileTypes.temple) ||
            (neighbors.top && neighbors.top.tileType === tileTypes.temple) ||
            (neighbors.bottom && neighbors.bottom.tileType === tileTypes.temple) ||
            (neighbors.right && neighbors.right.tileType === tileTypes.temple)

          if (
            !isJoiningKingdoms &&
            hasTempleNeighbor &&
            mapSquareTile.tileType === tileTypes.empty &&
            mapSquare !== mapTypes.river
          ) {
            eligibleTileLocations.push(i)
          }
        } else if (selectedTile.tileType === tileTypes.catastrophe) {
          if (
            !mapSquareTile.hasTreasure &&
            mapSquareTile.tileType !== tileTypes.catastrophe &&
            mapSquareTile.tileType !== tileTypes.monumentBottomLeft &&
            mapSquareTile.tileType !== tileTypes.monumentBottomRight &&
            mapSquareTile.tileType !== tileTypes.monumentTopLeft &&
            mapSquareTile.tileType !== tileTypes.monumentTopRight &&
            !mapSquareTile.isLeaderTile
          ) {
            eligibleTileLocations.push(i)
          }
        } else {
          if (
            mapSquareTile.tileType === tileTypes.empty &&
            ((mapSquare === mapTypes.river && selectedTile.tileType === tileTypes.farm) ||
              (mapSquare !== mapTypes.river && selectedTile.tileType !== tileTypes.farm))
          ) {
            eligibleTileLocations.push(i)
          }
        }
      }
    }

    setAvailableTileLocations(eligibleTileLocations)
  }

  function setRegions() {
    resetRegions()

    const indexesToCheck = [
      ...tiles.value
        .filter(
          (x) =>
            x.tileType !== tileTypes.empty &&
            x.tileType !== tileTypes.catastrophe &&
            (!conflictTile.value || conflictTile.value.index !== x.index)
        )
        .map((x) => x.index),
    ]

    const checkedIndexes: number[] = []

    for (let i = 0; i < indexesToCheck.length; i++) {
      if (!checkedIndexes.some((x) => x === indexesToCheck[i])) {
        const newRegionIndexes: number[] = []
        const queue: number[] = [indexesToCheck[i]]
        let isKingdom = false

        while (queue.length > 0) {
          const queueIndex = queue.shift()!
          if (!checkedIndexes.some((x) => x === queueIndex)) {
            newRegionIndexes.push(queueIndex)
            checkedIndexes.push(queueIndex)

            const indexContainsLeader = tiles.value[queueIndex]?.isLeaderTile
            if (indexContainsLeader && !isKingdom) isKingdom = indexContainsLeader

            const neighbors = getNeighbors(queueIndex)
            if (
              neighbors.left &&
              neighbors.left.tileType !== tileTypes.empty &&
              neighbors.left.tileType !== tileTypes.catastrophe
            )
              queue.push(neighbors.left.index)
            if (
              neighbors.top &&
              neighbors.top.tileType !== tileTypes.empty &&
              neighbors.top.tileType !== tileTypes.catastrophe
            )
              queue.push(neighbors.top.index)
            if (
              neighbors.right &&
              neighbors.right.tileType !== tileTypes.empty &&
              neighbors.right.tileType !== tileTypes.catastrophe
            )
              queue.push(neighbors.right.index)
            if (
              neighbors.bottom &&
              neighbors.bottom.tileType !== tileTypes.empty &&
              neighbors.bottom.tileType !== tileTypes.catastrophe
            )
              queue.push(neighbors.bottom.index)
          }
        }

        if (newRegionIndexes.length > 0) {
          addRegion({ tileIndexes: newRegionIndexes, isKingdom: isKingdom })
        }
      }
    }
  }

  function checkForTileScore(payload: BoardTile) {
    if (payload && !payload.isLeaderTile) {
      const region = getRegion(payload.index)
      const playersStore = usePlayersStore()

      if (region && region.isKingdom) {
        let matchingLeader = null
        let matchingKing = null

        for (let i = 0; i < region.tileIndexes.length; i++) {
          const matchingTile = tiles.value[region.tileIndexes[i]]
          if (matchingTile && matchingTile.isLeaderTile) {
            if (
              (matchingTile.tileType === tileTypes.priest &&
                payload.tileType === tileTypes.temple) ||
              (matchingTile.tileType === tileTypes.king &&
                payload.tileType === tileTypes.settlement) ||
              (matchingTile.tileType === tileTypes.farmer && payload.tileType === tileTypes.farm) ||
              (matchingTile.tileType === tileTypes.trader && payload.tileType === tileTypes.market)
            ) {
              matchingLeader = matchingTile
            } else if (matchingTile.tileType === tileTypes.king) {
              matchingKing = matchingTile
            }
          }
        }

        if (matchingLeader !== null && matchingLeader.playerId !== undefined) {
          playersStore.incrementScore({
            playerId: matchingLeader.playerId,
            scoreName: helpers.getTileNameByType(payload.tileType),
          })
        } else if (matchingKing !== null && matchingKing.playerId !== undefined) {
          playersStore.incrementScore({
            playerId: matchingKing.playerId,
            scoreName: helpers.getTileNameByType(payload.tileType),
          })
        }
      }
    }
  }

  function checkForTreasureToTake() {
    const gameStore = useGameStore()

    for (const region of regions.value) {
      const tilesWithTreasure: BoardTile[] = []
      if (region && region.isKingdom) {
        let matchingTrader = null

        for (let i = 0; i < region.tileIndexes.length; i++) {
          const tile = getTile(region.tileIndexes[i])
          if (tile) {
            if (tile.hasTreasure) tilesWithTreasure.push(tile)
            if (tile.tileType === tileTypes.trader) {
              matchingTrader = tile
            }
          }
        }

        if (tilesWithTreasure.length > 1 && matchingTrader !== null) {
          if (matchingTrader.playerId !== undefined) {
            gameStore.setActionPlayerId(matchingTrader.playerId)
          }
          const priorityTiles = tilesWithTreasure.filter(
            (tile) => map.value[tile.index] === mapTypes.priorityTreasure
          )

          if (priorityTiles.length === 1) {
            takeTreasure(priorityTiles[0])
          } else if (priorityTiles.length > 1) {
            for (let i = 0; i < priorityTiles.length; i++) {
              updateTile({ ...priorityTiles[i], isHighlighted: true })
            }
            gameStore.setActionType(actionTypes.takeTreasure)
          } else {
            for (let i = 0; i < tilesWithTreasure.length; i++) {
              updateTile({ ...tilesWithTreasure[i], isHighlighted: true })
            }
            gameStore.setActionType(actionTypes.takeTreasure)
          }
        }
      }

      setTreasuresToTake(tilesWithTreasure.length - 1)
    }
  }

  function checkForMonument(payload: BoardTile) {
    resetAvailableMonumentLocations()

    const neighbors = getNeighbors(payload.index)
    const top = neighbors.top?.tileType ?? tileTypes.empty
    const topRight = neighbors.topRight?.tileType ?? tileTypes.empty
    const right = neighbors.right?.tileType ?? tileTypes.empty
    const bottomRight = neighbors.bottomRight?.tileType ?? tileTypes.empty
    const bottom = neighbors.bottom?.tileType ?? tileTypes.empty
    const bottomLeft = neighbors.bottomLeft?.tileType ?? tileTypes.empty
    const left = neighbors.left?.tileType ?? tileTypes.empty
    const topLeft = neighbors.topLeft?.tileType ?? tileTypes.empty

    const foundAvailableMonumentLocations: any[] = []

    if ([topLeft, top, left].every((x) => x === payload.tileType) && neighbors.topLeft)
      foundAvailableMonumentLocations.push({
        index: neighbors.topLeft.index,
        tileType: neighbors.topLeft.tileType,
      })
    if ([top, topRight, right].every((x) => x === payload.tileType) && neighbors.top)
      foundAvailableMonumentLocations.push({
        index: neighbors.top.index,
        tileType: neighbors.top.tileType,
      })
    if ([right, bottomRight, bottom].every((x) => x === payload.tileType))
      foundAvailableMonumentLocations.push({ index: payload.index, tileType: payload.tileType })
    if ([bottom, bottomLeft, left].every((x) => x === payload.tileType) && neighbors.left)
      foundAvailableMonumentLocations.push({
        index: neighbors.left.index,
        tileType: neighbors.left.tileType,
      })

    if (foundAvailableMonumentLocations && foundAvailableMonumentLocations.length > 0) {
      setAvailableMonumentLocations(foundAvailableMonumentLocations)
      const gameStore = useGameStore()
      gameStore.setActionType(actionTypes.buildMonument)
    }
  }

  function buildMonument(payload: any) {
    const gameStore = useGameStore()
    const logStore = useLogStore()

    const target = getTile(payload.index)
    const targetNeighbors = getNeighbors(target.index)

    updateTile({ ...target, tileType: tileTypes.monumentTopLeft })
    updateTile({ ...targetNeighbors.right!, tileType: tileTypes.monumentTopRight })
    updateTile({ ...targetNeighbors.bottom!, tileType: tileTypes.monumentBottomLeft })
    updateTile({
      ...targetNeighbors.bottomRight!,
      tileType: tileTypes.monumentBottomRight,
      monumentType: payload.monumentType,
    })

    availableMonumentLocations.value.forEach((location) => {
      const tile = getTile(location.index)
      updateTile({ ...tile, isHighlighted: false })
    })

    gameStore.removeFromRemainingMonuments(payload.monumentType)
    resetAvailableMonumentLocations()
    gameStore.resetSelectedMonumentType()

    logStore.logActionMessage({
      playerId: gameStore.actionPlayerId,
      text: `built ${helpers.getMonumentNameByType(payload.monumentType)} monument at ${helpers.getCoordinatesByIndex(payload.index)}`,
    })

    checkForDisplacedLeader()
    setRegions()
    gameStore.setActionType(actionTypes.playTile)
    gameStore.actionCompleted()
    checkForTreasureToTake()
  }

  function checkForMonumentScore() {
    const gameStore = useGameStore()
    const playersStore = usePlayersStore()
    const playerId = gameStore.actionPlayerId
    const kingdoms = getKingdoms()

    kingdoms.forEach((kingdom) => {
      const playerLeaders: number[] = []
      const monuments: number[] = []

      kingdom.tileIndexes.forEach((index) => {
        const tile = tiles.value[index]
        if (tile.isLeaderTile && tile.playerId === playerId) playerLeaders.push(tile.tileType)
        if (tile.monumentType) monuments.push(tile.monumentType)
      })

      if (playerLeaders.length > 0 && monuments.length > 0) {
        monuments.forEach((monument) => {
          if (
            monumentTypes.redMonuments.includes(monument) &&
            playerLeaders.includes(tileTypes.priest)
          )
            playersStore.incrementScore({
              playerId: playerId,
              scoreName: helpers.getTileNameByType(tileTypes.temple),
            })
          if (
            monumentTypes.blueMonuments.includes(monument) &&
            playerLeaders.includes(tileTypes.farmer)
          )
            playersStore.incrementScore({
              playerId: playerId,
              scoreName: helpers.getTileNameByType(tileTypes.farm),
            })
          if (
            monumentTypes.greenMonuments.includes(monument) &&
            playerLeaders.includes(tileTypes.trader)
          )
            playersStore.incrementScore({
              playerId: playerId,
              scoreName: helpers.getTileNameByType(tileTypes.market),
            })
          if (
            monumentTypes.blackMonuments.includes(monument) &&
            playerLeaders.includes(tileTypes.king)
          )
            playersStore.incrementScore({
              playerId: playerId,
              scoreName: helpers.getTileNameByType(tileTypes.settlement),
            })
        })
      }
    })
  }

  function checkForDisplacedLeader() {
    for (let i = 0; i < tiles.value.length; i++) {
      const tile = tiles.value[i]
      if (tile.isLeaderTile) {
        const neighbors = getNeighbors(i)
        let hasTemple = false
        if (neighbors.bottom && neighbors.bottom.tileType === tileTypes.temple) hasTemple = true
        if (neighbors.left && neighbors.left.tileType === tileTypes.temple) hasTemple = true
        if (neighbors.right && neighbors.right.tileType === tileTypes.temple) hasTemple = true
        if (neighbors.top && neighbors.top.tileType === tileTypes.temple) hasTemple = true

        if (!hasTemple) {
          const playersStore = usePlayersStore()
          playersStore.addLeaderToPlayer(tile)
          removeTile({ index: tile.index })
        }
      }
    }
  }

  function checkForRevolt(tile: BoardTile) {
    const logStore = useLogStore()
    const gameStore = useGameStore()

    if (!tile || !tile.isLeaderTile) return

    const region = getRegion(tile.index)
    if (region && region.isKingdom) {
      let matchingDefenderLeader = null

      for (let i = 0; i < region.tileIndexes.length; i++) {
        const matchingTile = tiles.value[region.tileIndexes[i]]
        if (
          matchingTile &&
          matchingTile.isLeaderTile &&
          matchingTile.tileType === tile.tileType &&
          matchingTile.playerId !== tile.playerId
        ) {
          matchingDefenderLeader = { ...matchingTile }
          break
        }
      }

      if (matchingDefenderLeader && tile.playerId !== undefined) {
        updateTile({ ...tile, isHighlighted: true })
        updateTile({ ...matchingDefenderLeader, isHighlighted: true })
        gameStore.resetConflictData()
        gameStore.setActionPlayerId(tile.playerId)
        gameStore.setConflictAttackerLeader(tile)
        gameStore.setConflictDefenderLeader(matchingDefenderLeader)
        gameStore.setConflictAttackerBoardTiles(getRevoltBoardStrength(tile))
        gameStore.setConflictDefenderBoardTiles(getRevoltBoardStrength(matchingDefenderLeader))
        gameStore.setConflictTileType(tileTypes.temple)
        gameStore.setActionType(actionTypes.conflictAttack)
        gameStore.setConflictType(conflictTypes.revolt)

        logStore.logActionMessage({
          text: `A Revolt has begun between ${helpers.getLogToken(tile)}
            and ${helpers.getLogToken(matchingDefenderLeader)}`,
        })
      }
    }
  }

  function checkForWar(tile: BoardTile) {
    const gameStore = useGameStore()

    if (!tile || tile.isLeaderTile || tile.tileType === tileTypes.catastrophe) return

    if (!conflictTile.value) setConflictTile(tile)

    resetLeaderGroupsAtWar()

    const redLeaders: BoardTile[] = []
    const blackLeaders: BoardTile[] = []
    const greenLeaders: BoardTile[] = []
    const blueLeaders: BoardTile[] = []

    const neighboringKingdoms = neighborRegions(tile).filter((x) => x.isKingdom)

    for (const neighborKingdom of neighboringKingdoms) {
      for (const tileIndex of neighborKingdom.tileIndexes) {
        const neighborTile = getTile(tileIndex)
        if (!neighborTile.isLeaderTile) continue
        if (neighborTile.tileType === tileTypes.priest) redLeaders.push({ ...neighborTile })
        if (neighborTile.tileType === tileTypes.king) blackLeaders.push({ ...neighborTile })
        if (neighborTile.tileType === tileTypes.trader) greenLeaders.push({ ...neighborTile })
        if (neighborTile.tileType === tileTypes.farmer) blueLeaders.push({ ...neighborTile })
      }
    }

    const leaderGroups = [redLeaders, blackLeaders, greenLeaders, blueLeaders]
    const warLeaderGroups: BoardTile[][] = []

    for (const leaderGroup of leaderGroups) {
      if (leaderGroup.length >= 2) {
        leaderGroup.sort((a, b) => {
          if (a.playerId === tile.playerId && b.playerId !== tile.playerId) return -1
          if (a.playerId !== tile.playerId && b.playerId === tile.playerId) return 1
          return (a.playerId || 0) - (b.playerId || 0)
        })
        warLeaderGroups.push(leaderGroup)
        for (const leader of leaderGroup) {
          updateTile({ ...leader, isHighlighted: true })
        }
      }
    }

    if (warLeaderGroups.length === 0) {
      resetConflictTile()
    } else if (warLeaderGroups.length > 1) {
      setLeaderGroupsAtWar(warLeaderGroups)
      gameStore.setActionType(actionTypes.conflictChooseLeader)
    } else if (warLeaderGroups.length === 1) {
      triggerWar({ attacker: warLeaderGroups[0][0], defender: warLeaderGroups[0][1] })
    }
  }

  function triggerWar(payload: { attacker: BoardTile; defender: BoardTile }) {
    const gameStore = useGameStore()
    const logStore = useLogStore()

    if (!payload || !payload.attacker || !payload.defender) return

    gameStore.resetConflictData()

    if (payload.attacker.tileType === tileTypes.priest)
      gameStore.setConflictTileType(tileTypes.temple)
    if (payload.attacker.tileType === tileTypes.king)
      gameStore.setConflictTileType(tileTypes.settlement)
    if (payload.attacker.tileType === tileTypes.trader)
      gameStore.setConflictTileType(tileTypes.market)
    if (payload.attacker.tileType === tileTypes.farmer)
      gameStore.setConflictTileType(tileTypes.farm)

    const attacker = { ...payload.attacker }
    const defender = { ...payload.defender }

    updateTile({ ...attacker, isHighlighted: true })
    updateTile({ ...defender, isHighlighted: true })

    if (attacker.playerId !== undefined) {
      gameStore.setActionPlayerId(attacker.playerId)
    }
    gameStore.setConflictAttackerLeader(attacker)
    gameStore.setConflictDefenderLeader(defender)
    gameStore.setConflictAttackerBoardTiles(getWarBoardStrength(attacker))
    gameStore.setConflictDefenderBoardTiles(getWarBoardStrength(defender))
    gameStore.setActionType(actionTypes.conflictAttack)
    gameStore.setConflictType(conflictTypes.war)
    gameStore.setConflictWinnerPlayerId(0)

    logStore.logActionMessage({
      text: `A War has begun between ${helpers.getLogToken(attacker)}
        and ${helpers.getLogToken(defender)}`,
    })
  }

  function takeTreasure(tile: BoardTile) {
    const gameStore = useGameStore()
    const playersStore = usePlayersStore()
    const logStore = useLogStore()

    removeTreasure()
    playersStore.incrementScore({ playerId: gameStore.actionPlayerId, scoreName: 'treasure' })
    updateTile({ ...tile, hasTreasure: false, isHighlighted: false })
    resetBoardTileHighlights()

    logStore.logActionMessage({
      playerId: gameStore.actionPlayerId,
      text: `retreived a {treasure} from ${helpers.getCoordinatesByIndex(tile.index)}`,
    })

    checkForTreasureToTake()

    if (treasuresToTake.value < 1) {
      gameStore.setActionPlayerId(gameStore.turnPlayerId)
      gameStore.setActionType(actionTypes.playTile)
    }
  }

  // Mutations
  function setTreasureCounts(_newTiles?: BoardTile[]) {
    const initialTreasureCount = map.value.filter(
      (x) => x === mapTypes.treasure || x === mapTypes.priorityTreasure
    ).length
    initialTreasures.value = initialTreasureCount
    remainingTreasures.value = initialTreasureCount
  }

  function removeTreasure() {
    remainingTreasures.value--
  }

  function addTile(payload: BoardTile) {
    if (payload && tiles.value.length - 1 >= payload.index) {
      const tile: BoardTile = {
        index: payload.index,
        tileType: payload.tileType,
        isLeaderTile: payload.isLeaderTile,
        playerId: payload.playerId ?? 0,
        monumentType: payload.monumentType,
      }
      tiles.value.splice(payload.index, 1, tile)
    }
  }

  function removeTile(payload: { index: number }) {
    const newTile: BoardTile = {
      index: payload.index,
      tileType: tileTypes.empty,
      isLeaderTile: false,
      playerId: 0,
    }
    tiles.value.splice(payload.index, 1, newTile)
  }

  function updateTile(payload: BoardTile) {
    const matchingTile = tiles.value[payload.index]
    if (matchingTile) {
      tiles.value.splice(payload.index, 1, { ...payload })
    }
  }

  function setTiles(newTiles: BoardTile[]) {
    if (newTiles) {
      tiles.value = [...newTiles]
    }
  }

  function resetRegions() {
    regions.value = []
  }

  function addRegion(payload: { tileIndexes: number[]; isKingdom: boolean }) {
    regions.value.push({
      regionIndex: regions.value.length,
      tileIndexes: [...payload.tileIndexes],
      isKingdom: payload.isKingdom,
    })
  }

  function setAvailableTileLocations(payload: number[]) {
    if (payload) {
      availableTileLocations.value = payload
    }
  }

  function resetAvailableTileLocations() {
    availableTileLocations.value = []
  }

  function setAvailableMonumentLocations(payload: any[]) {
    if (payload) {
      availableMonumentLocations.value = payload
    }
  }

  function resetAvailableMonumentLocations() {
    availableMonumentLocations.value = []
  }

  function resetBoardTileHighlights() {
    tiles.value.forEach((tile) => {
      tile.isHighlighted = false
    })
  }

  function setTreasuresToTake(payload: number) {
    treasuresToTake.value = payload
  }

  function setConflictTile(tile: BoardTile) {
    conflictTile.value = { ...tile }
  }

  function resetConflictTile() {
    conflictTile.value = null
  }

  function setLeaderGroupsAtWar(payload: BoardTile[][]) {
    leaderGroupsAtWar.value = [...payload]
  }

  function resetLeaderGroupsAtWar() {
    leaderGroupsAtWar.value = []
  }

  return {
    map,
    tiles,
    regions,
    availableTileLocations,
    availableMonumentLocations,
    initialTreasures,
    remainingTreasures,
    treasuresToTake,
    conflictTile,
    leaderGroupsAtWar,
    getMap,
    getRiverPath,
    getTiles,
    getTile,
    getRegions,
    getInitialTreasures,
    getRemainingTreasures,
    getKingdoms,
    getAvailableTileLocations,
    getAvailableMonumentLocations,
    getNeighbors,
    getRegion,
    getKingdomIndex,
    getSelectedBoardLeader,
    neighborRegions,
    isValidTileLocation,
    getRevoltBoardStrength,
    getWarBoardStrength,
    init,
    handleBoardClick,
    calculateAvailableTileLocations,
    setRegions,
    checkForTileScore,
    checkForTreasureToTake,
    checkForMonument,
    buildMonument,
    checkForMonumentScore,
    checkForDisplacedLeader,
    checkForRevolt,
    checkForWar,
    triggerWar,
    takeTreasure,
    setTreasureCounts,
    removeTreasure,
    addTile,
    removeTile,
    updateTile,
    setTiles,
    resetRegions,
    addRegion,
    setAvailableTileLocations,
    resetAvailableTileLocations,
    setAvailableMonumentLocations,
    resetAvailableMonumentLocations,
    resetBoardTileHighlights,
    setTreasuresToTake,
    setConflictTile,
    resetConflictTile,
    setLeaderGroupsAtWar,
    resetLeaderGroupsAtWar,
  }
})
