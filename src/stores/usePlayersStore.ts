import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { actionTypes, tileTypes } from '@/common/constants'
import { useBagStore } from './useBagStore'
import { useGameStore } from './useGameStore'

interface PlayerScore {
  temple: number
  market: number
  farm: number
  settlement: number
  treasure: number
}

interface Player {
  id: number
  name: string
  hand: number[]
  leaders: number[]
  selectedTiles: any[]
  catastropheTiles: number
  score: PlayerScore
  isHuman: boolean
}

interface SelectedTile {
  index: number
  tileType: number
  isLeaderTile: boolean
}

export const usePlayersStore = defineStore('players', () => {
  // State
  const players = ref<Player[]>([])

  // Getters
  const currentPlayer = computed(() => {
    const gameStore = useGameStore()
    const turnPlayerId = gameStore.turnPlayerId
    const matching = players.value.filter((x) => x.id === turnPlayerId)
    return matching.length > 0 ? matching[0] : null
  })

  const getPlayer = (playerId: number) => {
    const matching = players.value.filter((x) => x.id === playerId)
    return matching.length > 0 ? matching[0] : null
  }

  const all = () => players.value

  // Actions
  async function createNewPlayer(payload: { name: string; isHuman: boolean }) {
    const bagStore = useBagStore()
    const hand = bagStore.drawTiles(6)
    const newPlayer: Player = {
      id: players.value.length + 1,
      name: payload.name,
      hand: hand,
      leaders: [tileTypes.king, tileTypes.priest, tileTypes.farmer, tileTypes.trader],
      selectedTiles: [],
      catastropheTiles: 2,
      score: {
        temple: 0,
        market: 0,
        farm: 0,
        settlement: 0,
        treasure: 0
      },
      isHuman: payload.isHuman
    }
    addNewPlayer(newPlayer)
    const gameStore = useGameStore()
    gameStore.incrementPlayerCount()
  }

  async function refillPlayerHands() {
    const gameStore = useGameStore()
    const bagStore = useBagStore()
    for (const player of players.value) {
      if (player.hand.length < 6) {
        const missingTiles = 6 - player.hand.length
        const drawnTiles = bagStore.drawTiles(missingTiles)
        if (gameStore.currentActionType === actionTypes.gameOver) break
        addTilesToPlayerHand({ playerId: player.id, tilesToAdd: drawnTiles })
      }
    }
  }

  async function swapTiles(player: Player) {
    const bagStore = useBagStore()
    if (player) {
      const tilesToRemove = [...player.selectedTiles]
      clearTileSelection(player.id)
      removeTilesFromHand({ playerId: player.id, tilesToRemove: tilesToRemove })
      const drawnTiles = bagStore.drawTiles(tilesToRemove.length)
      addTilesToPlayerHand({ playerId: player.id, tilesToAdd: drawnTiles })
    }
  }

  function addTileSelection(tile: any) {
    const player = players.value.find((x) => x.id === tile.playerId)
    if (player) {
      player.selectedTiles.push({
        index: tile.index,
        tileType: tile.tileType,
        isLeaderTile: tile.isLeaderTile
      })
    }
  }

  function removeTileSelection(tile: SelectedTile) {
    const player = players.value.find((x) => x.id === (tile as any).playerId)
    if (player) {
      const index = player.selectedTiles.findIndex(
        (x) => x.index === tile.index && x.isLeaderTile === tile.isLeaderTile
      )
      if (index >= 0) {
        player.selectedTiles.splice(index, 1)
      }
    }
  }

  function removeSelectedTiles(playerId: number) {
    const player = getPlayer(playerId)
    if (player) {
      player.selectedTiles.forEach((selectedTile) => {
        if (selectedTile.isLeaderTile) {
          removeLeaderFromHand({ playerId, ...selectedTile })
        } else if (selectedTile.tileType === tileTypes.catastrophe) {
          removeCatastropheFromHand({ playerId, ...selectedTile })
        } else {
          removeTileFromHand({ playerId, ...selectedTile })
        }
      })
      clearTileSelection(playerId)
    }
  }

  // Mutations
  function loadPlayers(newPlayers: Player[]) {
    players.value = [...newPlayers]
  }

  function clearPlayers() {
    players.value = []
  }

  function addNewPlayer(player: Player) {
    players.value.push(player)
  }

  function clearTileSelection(playerId: number) {
    const player = players.value.find((x) => x.id === playerId)
    if (player) {
      player.selectedTiles = []
    }
  }

  function removeTileFromHand(tile: any) {
    const player = players.value.find((x) => x.id === tile.playerId)
    if (player && player.hand && player.hand.length > tile.index) {
      player.hand.splice(tile.index, 1)
    }
  }

  function removeTilesFromHand(payload: { playerId: number; tilesToRemove: SelectedTile[] }) {
    const player = players.value.find((x) => x.id === payload.playerId)
    if (player && player.hand) {
      const indexesToRemove = payload.tilesToRemove.map((tileToRemove) => tileToRemove.index)
      if (player.hand.length >= indexesToRemove.length) {
        player.hand = player.hand.filter((_tile, index) => !indexesToRemove.includes(index))
      }
    }
  }

  function removeLeaderFromHand(leader: any) {
    const player = players.value.find((x) => x.id === leader.playerId)
    if (player && player.leaders) {
      const index = player.leaders.indexOf(leader.tileType)
      if (index >= 0) {
        player.leaders.splice(index, 1)
      }
    }
  }

  function removeCatastropheFromHand(catastrophe: any) {
    const player = players.value.find((x) => x.id === catastrophe.playerId)
    if (player && player.catastropheTiles > 0) {
      player.catastropheTiles--
    }
  }

  function addTilesToPlayerHand(payload: { playerId: number; tilesToAdd: number[] }) {
    const player = players.value.find((x) => x.id === payload.playerId)
    if (player) {
      player.hand = [...player.hand, ...payload.tilesToAdd]
    }
  }

  function addLeaderToPlayer(leader: any) {
    const player = players.value.find((x) => x.id === leader.playerId)
    if (player && player.leaders) {
      player.leaders.push(leader.tileType)
      player.leaders = player.leaders.sort((a, b) => a - b)
    }
  }

  function incrementScore(payload: { playerId: number; scoreName: string; scoreCount?: number }) {
    const player = players.value.find((x) => x.id === payload.playerId)
    if (player) {
      const scoreCount = payload.scoreCount || 1
      ;(player.score as any)[payload.scoreName] += scoreCount
    }
  }

  return {
    players,
    currentPlayer,
    getPlayer,
    all,
    createNewPlayer,
    refillPlayerHands,
    swapTiles,
    addTileSelection,
    removeTileSelection,
    removeSelectedTiles,
    loadPlayers,
    clearPlayers,
    addNewPlayer,
    clearTileSelection,
    removeTileFromHand,
    removeTilesFromHand,
    removeLeaderFromHand,
    removeCatastropheFromHand,
    addTilesToPlayerHand,
    addLeaderToPlayer,
    incrementScore
  }
})
