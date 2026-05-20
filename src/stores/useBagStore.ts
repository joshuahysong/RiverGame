import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { actionTypes, tileTypes } from '@/common/constants'
import { useGameStore } from './useGameStore'
import { useLogStore } from './useLogStore'

export const useBagStore = defineStore('bag', () => {
  // State
  const bag = ref<number[]>([])
  const temples = ref(0)
  const markets = ref(0)
  const settlements = ref(0)
  const farms = ref(0)
  const startingBag = ref<number[]>([])

  const defaultState = {
    temples: 47,
    markets: 30,
    settlements: 30,
    farms: 36
  }

  // Getters
  const all = () => ({
    bag: bag.value,
    temples: temples.value,
    markets: markets.value,
    settlements: settlements.value,
    farms: farms.value,
    startingBag: startingBag.value
  })

  const debugBagStats = () => ({
    bagCount: bag.value.length,
    temples: temples.value,
    markets: markets.value,
    settlements: settlements.value,
    farms: farms.value
  })

  const bagSpaceRemaining = computed(
    () => Math.round((bag.value.length / startingBag.value.length) * 100)
  )

  // Actions
  function init() {
    setState(defaultState)
    fillBag()
    shuffleBag()
  }

  function drawTiles(numberOfTiles: number): number[] {
    if (numberOfTiles) {
      shuffleBag()
      if (numberOfTiles > bag.value.length) {
        const logStore = useLogStore()
        logStore.logActionMessage({ text: 'Game has ended due to running out of tiles' })
        const gameStore = useGameStore()
        gameStore.save()
        gameStore.setActionType(actionTypes.gameOver)
      }
      const drawnTiles = bag.value.slice(0, numberOfTiles)
      removeTiles({ numberOfTiles, drawnTiles })
      return drawnTiles
    }
    return []
  }

  function fillBag() {
    const unshuffled: number[] = []
    bag.value = []
    unshuffled.push(
      ...Array(temples.value).fill(tileTypes.temple, 0),
      ...Array(markets.value).fill(tileTypes.market, 0),
      ...Array(settlements.value).fill(tileTypes.settlement, 0),
      ...Array(farms.value).fill(tileTypes.farm, 0)
    )
    bag.value = [...unshuffled]
  }

  function shuffleBag() {
    const unshuffled = [...bag.value]
    const shuffled = unshuffled
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
    bag.value = [...shuffled]
  }

  function removeTiles(payload: { numberOfTiles: number; drawnTiles: number[] }) {
    bag.value.splice(0, payload.numberOfTiles)
    payload.drawnTiles.forEach((tile) => {
      if (tile === tileTypes.temple) temples.value--
      if (tile === tileTypes.market) markets.value--
      if (tile === tileTypes.settlement) settlements.value--
      if (tile === tileTypes.farm) farms.value--
    })
  }

  function setStartingBag() {
    startingBag.value = [...bag.value]
  }

  function setState(newState: Partial<{
    bag: number[]
    temples: number
    markets: number
    settlements: number
    farms: number
    startingBag: number[]
  }>) {
    if (newState.bag !== undefined) bag.value = newState.bag
    if (newState.temples !== undefined) temples.value = newState.temples
    if (newState.markets !== undefined) markets.value = newState.markets
    if (newState.settlements !== undefined) settlements.value = newState.settlements
    if (newState.farms !== undefined) farms.value = newState.farms
    if (newState.startingBag !== undefined) startingBag.value = newState.startingBag
  }

  return {
    bag,
    temples,
    markets,
    settlements,
    farms,
    startingBag,
    bagSpaceRemaining,
    all,
    debugBagStats,
    init,
    drawTiles,
    fillBag,
    shuffleBag,
    removeTiles,
    setStartingBag,
    setState
  }
})
