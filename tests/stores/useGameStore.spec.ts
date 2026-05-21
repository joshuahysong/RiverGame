import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestingPinia } from '../utils'
import { useGameStore } from '@/stores/useGameStore'
import { actionTypes, conflictTypes, monumentTypes } from '@/common/constants'

describe('useGameStore', () => {
  beforeEach(() => {
    createTestingPinia()
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('initializes with default values', () => {
    const gameStore = useGameStore()
    expect(gameStore.turnPlayerId).toBe(1)
    expect(gameStore.actionPlayerId).toBe(1)
    expect(gameStore.visiblePlayerId).toBe(0)
    expect(gameStore.numberOfPlayers).toBe(0)
    expect(gameStore.remainingActions).toBe(2)
    expect(gameStore.currentActionType).toBe(actionTypes.loading)
  })

  it('sets action type correctly', () => {
    const gameStore = useGameStore()
    gameStore.setActionType(actionTypes.playTile)
    expect(gameStore.currentActionType).toBe(actionTypes.playTile)
  })

  it('decrements remaining actions', () => {
    const gameStore = useGameStore()
    gameStore.remainingActions = 3
    gameStore.actionCompleted()
    expect(gameStore.remainingActions).toBe(2)
  })

  it('has no snapshot initially', () => {
    const gameStore = useGameStore()
    expect(gameStore.hasSnapshot).toBe(false)
  })

  it('initializes monuments array', () => {
    const gameStore = useGameStore()
    expect(gameStore.remainingMonuments).toHaveLength(6)
    expect(gameStore.remainingMonuments).toContain(monumentTypes.redBlue)
    expect(gameStore.remainingMonuments).toContain(monumentTypes.blueGreen)
  })

  it('resets state with init()', () => {
    const gameStore = useGameStore()
    
    // Modify state
    gameStore.turnPlayerId = 5
    gameStore.actionPlayerId = 3
    gameStore.remainingActions = 0
    gameStore.currentActionType = actionTypes.buildMonument
    
    // Reset
    gameStore.init()
    
    // Verify reset
    expect(gameStore.turnPlayerId).toBe(1)
    expect(gameStore.actionPlayerId).toBe(1)
    expect(gameStore.remainingActions).toBe(2)
    expect(gameStore.currentActionType).toBe(actionTypes.playTile)
  })

  it('sets conflict type', () => {
    const gameStore = useGameStore()
    gameStore.conflictType = conflictTypes.war
    expect(gameStore.conflictType).toBe(conflictTypes.war)
  })

  it('tracks conflict winner', () => {
    const gameStore = useGameStore()
    gameStore.conflictWinnerPlayerId = 2
    expect(gameStore.conflictWinnerPlayerId).toBe(2)
  })

  it('advances to next active player', () => {
    const gameStore = useGameStore()
    gameStore.numberOfPlayers = 3
    gameStore.turnPlayerId = 1
    gameStore.actionPlayerId = 1
    
    gameStore.nextActivePlayer()
    
    expect(gameStore.turnPlayerId).toBe(2)
    expect(gameStore.actionPlayerId).toBe(2)
    expect(gameStore.remainingActions).toBe(2)
  })

  it('wraps around when advancing past last player', () => {
    const gameStore = useGameStore()
    gameStore.numberOfPlayers = 3
    gameStore.turnPlayerId = 3
    gameStore.actionPlayerId = 3
    
    gameStore.nextActivePlayer()
    
    expect(gameStore.turnPlayerId).toBe(1)
    expect(gameStore.actionPlayerId).toBe(1)
  })

  it('checks for valid save in localStorage', () => {
    const gameStore = useGameStore()
    
    // No save initially
    expect(gameStore.isSaveValid).toBe(false)
    
    // Note: isSaveValid checks against import.meta.env.VITE_APP_VERSION
    // In test environment, this may be undefined
    // The computed property returns false if no localStorage or version mismatch
    
    // Add a save (version doesn't match test env, so still false)
    localStorage.gameState = JSON.stringify({ version: '1.0.0' })
    // We expect false because the test env likely has undefined VITE_APP_VERSION
    expect(gameStore.isSaveValid).toBe(false)
  })
})
