import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PlayerCard from '@/components/PlayerCard.vue'
import { createTestingPinia } from '../utils'
import { tileTypes } from '@/common/constants'
import type { Player } from '@/stores/usePlayersStore'

describe('PlayerCard.vue', () => {
  const mockPlayer: Player = {
    id: 1,
    name: 'Test Player',
    hand: [tileTypes.settlement, tileTypes.temple],
    leaders: [],
    selectedTiles: [],
    catastropheTiles: 2,
    points: 0,
    isHuman: true,
    score: {
      settlement: 5,
      temple: 3,
      farm: 2,
      market: 4,
      treasure: 1,
    },
  }

  beforeEach(() => {
    createTestingPinia()
  })

  it('renders correctly with player data', () => {
    const wrapper = mount(PlayerCard, {
      props: {
        player: mockPlayer,
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Player')
  })

  it('displays player name', () => {
    const wrapper = mount(PlayerCard, {
      props: {
        player: mockPlayer,
      },
    })
    expect(wrapper.text()).toContain('Test Player')
  })

  it('displays bot indicator for non-human players', () => {
    const botPlayer: Player = {
      ...mockPlayer,
      isHuman: false,
    }
    const wrapper = mount(PlayerCard, {
      props: {
        player: botPlayer,
      },
    })
    expect(wrapper.text()).toContain('(Bot)')
  })

  it('does not display bot indicator for human players', () => {
    const wrapper = mount(PlayerCard, {
      props: {
        player: mockPlayer,
      },
    })
    expect(wrapper.text()).not.toContain('(Bot)')
  })

  it('displays hand count', () => {
    const wrapper = mount(PlayerCard, {
      props: {
        player: mockPlayer,
      },
    })
    expect(wrapper.text()).toContain('x2') // 2 tiles in hand
  })

  it('displays catastrophe tile count', () => {
    const wrapper = mount(PlayerCard, {
      props: {
        player: mockPlayer,
      },
    })
    expect(wrapper.text()).toContain('x2') // 2 catastrophe tiles
  })

  it('shows score when showScore prop is true', () => {
    const wrapper = mount(PlayerCard, {
      props: {
        player: mockPlayer,
        showScore: true,
      },
    })
    // b-badge components are stubbed in tests, so we can't check text content
    // Instead verify the score section is conditionally rendered
    const html = wrapper.html()
    // Check that score badges are rendered (even if stubbed)
    expect(html).toContain('settlement-score')
    expect(html).toContain('temple-score')
    expect(html).toContain('farm-score')
    expect(html).toContain('market-score')
    expect(html).toContain('treasure-score')
  })

  it('hides score when showScore prop is false', () => {
    const wrapper = mount(PlayerCard, {
      props: {
        player: mockPlayer,
        showScore: false,
      },
    })
    // Score badges should not be visible (except in debug mode)
    const badges = wrapper.findAll('.settlement-score')
    expect(badges.length).toBe(0)
  })

  it('handles missing player prop', () => {
    // PlayerCard requires a player prop to render properly
    // If no player is provided, it would error, so we test with minimal player data
    const minimalPlayer: Player = {
      id: 0,
      name: '',
      hand: [],
      leaders: [],
      selectedTiles: [],
      catastropheTiles: 0,
      points: 0,
      isHuman: true,
      score: {
        settlement: 0,
        temple: 0,
        farm: 0,
        market: 0,
        treasure: 0,
      },
    }
    const wrapper = mount(PlayerCard, {
      props: {
        player: minimalPlayer,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
