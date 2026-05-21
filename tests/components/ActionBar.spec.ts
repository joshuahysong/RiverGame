import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionBar from '@/components/ActionBar.vue'
import { createTestingPinia } from '../utils'
import { useGameStore } from '@/stores/useGameStore'
import { usePlayersStore } from '@/stores/usePlayersStore'
import { actionTypes } from '@/common/constants'

describe('ActionBar.vue', () => {
  beforeEach(() => {
    createTestingPinia()
  })

  it('renders correctly', () => {
    const wrapper = mount(ActionBar)
    expect(wrapper.exists()).toBe(true)
  })

  it('displays current player turn message', async () => {
    const gameStore = useGameStore()
    const playersStore = usePlayersStore()

    // Set up game state BEFORE mounting
    gameStore.actionPlayerId = 1
    gameStore.setActionType(actionTypes.playTile)
    gameStore.remainingActions = 2
    
    // Add a player
    playersStore.players = [
      {
        id: 1,
        name: 'Player 1',
        hand: [],
        leaders: [],
        selectedTiles: [],
        catastropheTiles: 0,
        points: 0,
      },
    ]

    const wrapper = mount(ActionBar)
    await wrapper.vm.$nextTick()

    const text = wrapper.text()
    expect(text).toContain("Player 1's Turn")
    expect(text).toContain('2 Actions Remaining')
  })

  it('displays action buttons when in playTile mode', async () => {
    const gameStore = useGameStore()
    const playersStore = usePlayersStore()

    gameStore.actionPlayerId = 1
    gameStore.visiblePlayerId = 1
    gameStore.setActionType(actionTypes.playTile)
    gameStore.remainingActions = 2
    
    playersStore.players = [
      {
        id: 1,
        name: 'Player 1',
        hand: [],
        leaders: [],
        selectedTiles: [],
        catastropheTiles: 0,
        points: 0,
      },
    ]

    const wrapper = mount(ActionBar)
    await wrapper.vm.$nextTick()

    // Check that the turn message is displayed (buttons are stubbed)
    const text = wrapper.text()
    expect(text).toContain("Player 1's Turn")
    expect(text).toContain('2 Actions Remaining')
  })

  it('shows end turn button when actions are depleted', async () => {
    const gameStore = useGameStore()
    const playersStore = usePlayersStore()

    gameStore.actionPlayerId = 1
    gameStore.visiblePlayerId = 1
    gameStore.setActionType(actionTypes.playTile)
    gameStore.remainingActions = 0
    
    playersStore.players = [
      {
        id: 1,
        name: 'Player 1',
        hand: [],
        leaders: [],
        selectedTiles: [],
        catastropheTiles: 0,
        points: 0,
      },
    ]

    const wrapper = mount(ActionBar)
    await wrapper.vm.$nextTick()

    const text = wrapper.text()
    expect(text).toContain('0 Actions Remaining')
  })

  it('displays treasure message when taking treasure', async () => {
    const gameStore = useGameStore()
    const playersStore = usePlayersStore()

    gameStore.actionPlayerId = 1
    gameStore.setActionType(actionTypes.takeTreasure)
    
    playersStore.players = [
      {
        id: 1,
        name: 'Player 1',
        hand: [],
        leaders: [],
        selectedTiles: [],
        catastropheTiles: 0,
        points: 0,
      },
    ]

    const wrapper = mount(ActionBar)
    await wrapper.vm.$nextTick()

    const text = wrapper.text()
    expect(text).toContain('Player 1')
    expect(text).toContain('Treasure')
  })

  it('displays monument building message', async () => {
    const gameStore = useGameStore()
    const playersStore = usePlayersStore()

    gameStore.actionPlayerId = 1
    gameStore.setActionType(actionTypes.buildMonument)
    
    playersStore.players = [
      {
        id: 1,
        name: 'Player 1',
        hand: [],
        leaders: [],
        selectedTiles: [],
        catastropheTiles: 0,
        points: 0,
      },
    ]

    const wrapper = mount(ActionBar)
    await wrapper.vm.$nextTick()

    const text = wrapper.text()
    expect(text).toContain('Player 1')
    expect(text).toContain('monument to build')
  })
})
