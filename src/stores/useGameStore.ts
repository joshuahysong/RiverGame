import { defineStore } from 'pinia'
import { ref } from 'vue'
import { actionTypes, conflictTypes, messageTypes, monumentTypes, tileTypes } from '@/common/constants'
import { usePlayersStore } from './usePlayersStore'
import { useBoardStore } from './useBoardStore'
import { useBagStore } from './useBagStore'
import { useLogStore } from './useLogStore'
import helpers from '@/common/helpers'

interface ConflictSnapshot {
  players: any[]
  log: any[]
  tiles: any[]
  bag: any
  game: any
}

export const useGameStore = defineStore('game', () => {
  // State
  const turnPlayerId = ref<number>(1)
  const actionPlayerId = ref<number>(1)
  const visiblePlayerId = ref<number>(0)
  const numberOfPlayers = ref<number>(0)
  const remainingActions = ref<number>(2)
  const currentActionType = ref<number>(actionTypes.loading)
  const conflictType = ref<number>(conflictTypes.none)
  const conflictAttackerLeader = ref<any>(null)
  const conflictDefenderLeader = ref<any>(null)
  const conflictAttackerTiles = ref<any[]>([])
  const conflictDefenderTiles = ref<any[]>([])
  const conflictAttackerBoardTiles = ref<any[]>([])
  const conflictDefenderBoardTiles = ref<any[]>([])
  const conflictTileType = ref<number>(tileTypes.empty)
  const conflictWinnerPlayerId = ref<number>(0)
  const remainingMonuments = ref<number[]>([
    monumentTypes.redBlue,
    monumentTypes.blueGreen,
    monumentTypes.greenRed,
    monumentTypes.blackRed,
    monumentTypes.blackGreen,
    monumentTypes.blackBlue
  ])
  const selectedMonumentType = ref<number>(0)
  const snapshot = ref<ConflictSnapshot | null>(null)

  const DEBUG = false

  // Getters
  const debug = () => DEBUG
  const isSaveValid = () => {
    if (localStorage.gameState) {
      const gameState = JSON.parse(localStorage.gameState)
      return gameState.version === import.meta.env.VITE_APP_VERSION
    }
    return false
  }

  const hasSnapshot = () => !!snapshot.value

  // Actions
  function init() {
    turnPlayerId.value = 1
    actionPlayerId.value = 1
    visiblePlayerId.value = 0
    numberOfPlayers.value = 0
    remainingActions.value = 2
    currentActionType.value = actionTypes.playTile
    conflictType.value = conflictTypes.none
    conflictAttackerLeader.value = null
    conflictDefenderLeader.value = null
    conflictAttackerTiles.value = []
    conflictDefenderTiles.value = []
    conflictAttackerBoardTiles.value = []
    conflictDefenderBoardTiles.value = []
    conflictTileType.value = tileTypes.empty
    conflictWinnerPlayerId.value = 0
    remainingMonuments.value = [
      monumentTypes.redBlue,
      monumentTypes.blueGreen,
      monumentTypes.greenRed,
      monumentTypes.blackRed,
      monumentTypes.blackGreen,
      monumentTypes.blackBlue
    ]
    selectedMonumentType.value = 0
    snapshot.value = null
  }

  function save() {
    const gameState: any = {}
    gameState.version = import.meta.env.VITE_APP_VERSION
    const playersStore = usePlayersStore()
    const boardStore = useBoardStore()
    const bagStore = useBagStore()
    const logStore = useLogStore()

    gameState.players = playersStore.all()
    gameState.tiles = boardStore.tiles
    gameState.bag = bagStore.all()
    const messages = logStore.getMessages()
    gameState.log = messages.filter((x) => x.messageType !== messageTypes.system)
    gameState.game = {
      turnPlayerId: turnPlayerId.value,
      actionPlayerId: actionPlayerId.value,
      visiblePlayerId: visiblePlayerId.value,
      numberOfPlayers: numberOfPlayers.value,
      remainingActions: remainingActions.value,
      currentActionType: currentActionType.value,
      conflictType: conflictType.value,
      conflictAttackerLeader: conflictAttackerLeader.value,
      conflictDefenderLeader: conflictDefenderLeader.value,
      conflictAttackerTiles: conflictAttackerTiles.value,
      conflictDefenderTiles: conflictDefenderTiles.value,
      conflictAttackerBoardTiles: conflictAttackerBoardTiles.value,
      conflictDefenderBoardTiles: conflictDefenderBoardTiles.value,
      conflictTileType: conflictTileType.value,
      conflictWinnerPlayerId: conflictWinnerPlayerId.value,
      remainingMonuments: remainingMonuments.value,
      selectedMonumentType: selectedMonumentType.value,
      snapshot: snapshot.value
    }
    localStorage.gameState = JSON.stringify(gameState)
  }

  function load() {
    const gameState = ref<any>(null)
    setActionType(actionTypes.loading)
    if (localStorage.gameState) {
      gameState.value = JSON.parse(localStorage.gameState)
      if (!gameState.value) return
      
      const playersStore = usePlayersStore()
      const boardStore = useBoardStore()
      const bagStore = useBagStore()
      const logStore = useLogStore()

      playersStore.loadPlayers(gameState.value.players)
      boardStore.setTiles(gameState.value.tiles)
      boardStore.setTreasureCounts(gameState.value.tiles)
      boardStore.setRegions()
      bagStore.setState(gameState.value.bag)
      logStore.setMessages(gameState.value.log)
      setState(gameState.value.game)
      logStore.logSystemMessage('Game load successful.')
    }
  }

  function saveSnapshot() {
    const playersStore = usePlayersStore()
    const boardStore = useBoardStore()
    const bagStore = useBagStore()
    const logStore = useLogStore()

    const newSnapshot: ConflictSnapshot = {
      players: [],
      log: [],
      tiles: [],
      bag: bagStore.all(),
      game: {}
    }

    const players = playersStore.all()
    players.forEach((player) => {
      newSnapshot.players.push(JSON.parse(JSON.stringify({ ...player, selectedTiles: [] })))
    })
    newSnapshot.log = JSON.parse(JSON.stringify(logStore.getMessages()))
    newSnapshot.tiles = [...boardStore.tiles]
    newSnapshot.game = {
      turnPlayerId: turnPlayerId.value,
      actionPlayerId: actionPlayerId.value,
      visiblePlayerId: visiblePlayerId.value,
      remainingActions: remainingActions.value,
      currentActionType: currentActionType.value,
      conflictAttackerLeader: { ...conflictAttackerLeader.value },
      conflictDefenderLeader: { ...conflictDefenderLeader.value },
      conflictAttackerTiles: [...conflictAttackerTiles.value],
      conflictDefenderTiles: [...conflictDefenderTiles.value],
      remainingMonuments: [...remainingMonuments.value],
      selectedMonumentType: 0
    }
    snapshot.value = { ...newSnapshot }
  }

  function restoreSnapshot() {
    if (hasSnapshot()) {
      const playersStore = usePlayersStore()
      const boardStore = useBoardStore()
      const bagStore = useBagStore()
      const logStore = useLogStore()

      playersStore.loadPlayers(snapshot.value!.players)
      boardStore.setTiles(snapshot.value!.tiles)
      boardStore.setTreasureCounts(snapshot.value!.tiles)
      boardStore.setRegions()
      bagStore.setState(snapshot.value!.bag)
      logStore.setMessages([...snapshot.value!.log])
      setState({ ...snapshot.value!.game })
    }
  }

  function resolveConflict() {
    const playersStore = usePlayersStore()
    const boardStore = useBoardStore()
    const logStore = useLogStore()

    let winner = null
    let loser = null
    let winnerStrength = 0
    let loserStrength = 0
    let loserTiles = []

    const attackerStrength = conflictAttackerBoardTiles.value.length + conflictAttackerTiles.value.length
    const defenderStrength = conflictDefenderBoardTiles.value.length + conflictDefenderTiles.value.length

    if (attackerStrength > defenderStrength) {
      winnerStrength = attackerStrength
      loserStrength = defenderStrength
      winner = { ...conflictAttackerLeader.value }
      loser = { ...conflictDefenderLeader.value }
      loserTiles = [...conflictDefenderBoardTiles.value]
    } else {
      winnerStrength = defenderStrength
      loserStrength = attackerStrength
      winner = { ...conflictDefenderLeader.value }
      loser = { ...conflictAttackerLeader.value }
      loserTiles = [...conflictAttackerBoardTiles.value]
    }

    if (conflictType.value === conflictTypes.revolt) {
      playersStore.incrementScore({
        playerId: winner.playerId,
        scoreName: helpers.getTileNameByType(tileTypes.temple)
      })
    } else {
      let scoreCount = 0
      for (const loserTile of loserTiles) {
        if (loserTile.hasTreasure) continue
        if (loserTile.tileType === conflictTileType.value) {
          scoreCount++
          boardStore.removeTile({ index: loserTile.index })
        }
      }
      playersStore.incrementScore({
        playerId: winner.playerId,
        scoreName: helpers.getTileNameByType(conflictTileType.value),
        scoreCount: scoreCount
      })
    }

    playersStore.addLeaderToPlayer(loser)
    boardStore.removeTile({ index: loser.index })
    boardStore.resetBoardTileHighlights()
    boardStore.checkForDisplacedLeader()
    boardStore.setRegions()
    conflictWinnerPlayerId.value = winner.playerId

    logStore.logActionMessage({
      text: `${helpers.getLogToken(winner)} (${winnerStrength})
        wins the ${conflictType.value === conflictTypes.revolt ? 'Revolt' : 'War'}
        against ${helpers.getLogToken(loser)} (${loserStrength})`
    })
  }

  // Mutations
  function nextActivePlayer() {
    const newTurnPlayerId = turnPlayerId.value >= numberOfPlayers.value ? 1 : turnPlayerId.value + 1
    turnPlayerId.value = newTurnPlayerId
    actionPlayerId.value = newTurnPlayerId
    remainingActions.value = 2
    currentActionType.value = actionTypes.playTile
  }

  function incrementPlayerCount() {
    numberOfPlayers.value++
  }

  function actionCompleted() {
    remainingActions.value--
  }

  function setActionType(actionType: number) {
    currentActionType.value = actionType
  }

  function setState(newState: Partial<{
    turnPlayerId: number
    actionPlayerId: number
    visiblePlayerId: number
    numberOfPlayers: number
    remainingActions: number
    currentActionType: number
    conflictType: number
    conflictAttackerLeader: any
    conflictDefenderLeader: any
    conflictAttackerTiles: any[]
    conflictDefenderTiles: any[]
    conflictAttackerBoardTiles: any[]
    conflictDefenderBoardTiles: any[]
    conflictTileType: number
    conflictWinnerPlayerId: number
    remainingMonuments: number[]
    selectedMonumentType: number
    snapshot: ConflictSnapshot | null
  }>) {
    if (newState.turnPlayerId !== undefined) turnPlayerId.value = newState.turnPlayerId
    if (newState.actionPlayerId !== undefined) actionPlayerId.value = newState.actionPlayerId
    if (newState.visiblePlayerId !== undefined) visiblePlayerId.value = newState.visiblePlayerId
    if (newState.numberOfPlayers !== undefined) numberOfPlayers.value = newState.numberOfPlayers
    if (newState.remainingActions !== undefined) remainingActions.value = newState.remainingActions
    if (newState.currentActionType !== undefined) currentActionType.value = newState.currentActionType
    if (newState.conflictType !== undefined) conflictType.value = newState.conflictType
    if (newState.conflictAttackerLeader !== undefined) conflictAttackerLeader.value = newState.conflictAttackerLeader
    if (newState.conflictDefenderLeader !== undefined) conflictDefenderLeader.value = newState.conflictDefenderLeader
    if (newState.conflictAttackerTiles !== undefined) conflictAttackerTiles.value = newState.conflictAttackerTiles
    if (newState.conflictDefenderTiles !== undefined) conflictDefenderTiles.value = newState.conflictDefenderTiles
    if (newState.conflictAttackerBoardTiles !== undefined) conflictAttackerBoardTiles.value = newState.conflictAttackerBoardTiles
    if (newState.conflictDefenderBoardTiles !== undefined) conflictDefenderBoardTiles.value = newState.conflictDefenderBoardTiles
    if (newState.conflictTileType !== undefined) conflictTileType.value = newState.conflictTileType
    if (newState.conflictWinnerPlayerId !== undefined) conflictWinnerPlayerId.value = newState.conflictWinnerPlayerId
    if (newState.remainingMonuments !== undefined) remainingMonuments.value = newState.remainingMonuments
    if (newState.selectedMonumentType !== undefined) selectedMonumentType.value = newState.selectedMonumentType
    if (newState.snapshot !== undefined) snapshot.value = newState.snapshot
  }

  function setActionPlayerId(playerId: number) {
    if (visiblePlayerId.value !== playerId) visiblePlayerId.value = 0
    actionPlayerId.value = playerId
  }

  function setVisiblePlayerId(playerId: number) {
    visiblePlayerId.value = playerId
  }

  function setConflictAttackerLeader(leader: any) {
    conflictAttackerLeader.value = { ...leader }
  }

  function setConflictDefenderLeader(leader: any) {
    conflictDefenderLeader.value = { ...leader }
  }

  function setConflictAttackerTiles(tiles: any[]) {
    conflictAttackerTiles.value = [...tiles]
  }

  function setConflictDefenderTiles(tiles: any[]) {
    conflictDefenderTiles.value = [...tiles]
  }

  function setConflictAttackerBoardTiles(tiles: any[]) {
    conflictAttackerBoardTiles.value = [...tiles]
  }

  function setConflictDefenderBoardTiles(tiles: any[]) {
    conflictDefenderBoardTiles.value = [...tiles]
  }

  function setConflictTileType(tileType: number) {
    conflictTileType.value = tileType
  }

  function resetConflictData() {
    conflictAttackerLeader.value = null
    conflictDefenderLeader.value = null
    conflictAttackerTiles.value = []
    conflictDefenderTiles.value = []
    conflictAttackerBoardTiles.value = []
    conflictDefenderBoardTiles.value = []
    conflictTileType.value = tileTypes.empty
    conflictWinnerPlayerId.value = 0
    conflictType.value = conflictTypes.none
  }

  function removeFromRemainingMonuments(monumentType: number) {
    const index = remainingMonuments.value.findIndex((m) => m === monumentType)
    if (index >= 0) {
      remainingMonuments.value.splice(index, 1)
    }
  }

  function resetSelectedMonumentType() {
    selectedMonumentType.value = 0
  }

  function setSelectedMonumentType(monumentType: number) {
    selectedMonumentType.value = monumentType
  }

  function setSnapshot(newSnapshot: ConflictSnapshot) {
    snapshot.value = { ...newSnapshot }
  }

  function clearSnapshot() {
    snapshot.value = null
  }

  function setConflictType(newConflictType: number) {
    conflictType.value = newConflictType
  }

  function setConflictWinnerPlayerId(playerId: number) {
    conflictWinnerPlayerId.value = playerId
  }

  return {
    turnPlayerId,
    actionPlayerId,
    visiblePlayerId,
    numberOfPlayers,
    remainingActions,
    currentActionType,
    conflictType,
    conflictAttackerLeader,
    conflictDefenderLeader,
    conflictAttackerTiles,
    conflictDefenderTiles,
    conflictAttackerBoardTiles,
    conflictDefenderBoardTiles,
    conflictTileType,
    conflictWinnerPlayerId,
    remainingMonuments,
    selectedMonumentType,
    snapshot,
    debug,
    isSaveValid,
    hasSnapshot,
    init,
    save,
    load,
    saveSnapshot,
    restoreSnapshot,
    resolveConflict,
    nextActivePlayer,
    incrementPlayerCount,
    actionCompleted,
    setActionType,
    setState,
    setActionPlayerId,
    setVisiblePlayerId,
    setConflictAttackerLeader,
    setConflictDefenderLeader,
    setConflictAttackerTiles,
    setConflictDefenderTiles,
    setConflictAttackerBoardTiles,
    setConflictDefenderBoardTiles,
    setConflictTileType,
    resetConflictData,
    removeFromRemainingMonuments,
    resetSelectedMonumentType,
    setSelectedMonumentType,
    setSnapshot,
    clearSnapshot,
    setConflictType,
    setConflictWinnerPlayerId
  }
})
