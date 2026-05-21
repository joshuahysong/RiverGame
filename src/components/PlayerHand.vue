<template>
  <div
    v-if="player"
    class="card"
  >
    <div class="card-header bg-transparent border-0 py-2">
      <strong>Hand</strong>
    </div>
    <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
      <div
        v-if="visiblePlayerId !== player.id"
        class="row g-0"
      >
        <div class="col">
          <div class="row g-0 justify-content-center align-items-center">
            <div class="col-auto col-xl-12">
              <component
                v-if="leaderIcon"
                :is="leaderIcon"
                class="me-2"
              />{{ player.name }}'s Turn
            </div>
            <div
              v-if="player.isHuman"
              class="col-auto col-xl-12 ps-2 ps-xl-0"
            >
              <b-button
                variant="success"
                size="sm"
                class="mt-0 mt-xl-2"
                @click="setPlayerVisible"
              >
                Continue
              </b-button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="row g-0"
      >
        <div class="col-auto col-xl-12 align-self-center justify-content-center">
          <div class="row g-0">
            <div class="col-auto col-xl-12 text-end text-xl-center">
              <leader-tile
                v-for="(tileType, index) in leaderTileTypes.slice(0, 2)"
                :key="index"
                :size="size"
                :tile-type="tileType"
                :player="player"
                :class="index !== 3 ? 'me-1 me-md-2' : ''"
                :selected="isSelectedTile(index, tileType)"
                :highlight="isHighlightedLeader(tileType)"
                :disabled="isDisabled(tileType)"
                :show-pointer="!isInConflict"
                show-empty
                @click="selectTile(index, tileType)"
              />
            </div>
            <div class="col-auto col-xl-12 text-start text-xl-center">
              <leader-tile
                v-for="(tileType, index) in leaderTileTypes.slice(2, 4)"
                :key="index"
                :size="size"
                :tile-type="tileType"
                :player="player"
                :class="index !== 3 ? 'me-1 me-md-2' : ''"
                :selected="isSelectedTile(index + 2, tileType)"
                :highlight="isHighlightedLeader(tileType)"
                :disabled="isDisabled(tileType)"
                :show-pointer="!isInConflict"
                show-empty
                @click="selectTile(index + 2, tileType)"
              />
            </div>
          </div>
        </div>
        <div class="col col-xl-12 align-self-center justify-content-center pt-xl-4">
          <div class="row g-0">
            <div class="col col-xl-12 text-end text-xl-center">
              <civilization-tile
                v-for="(tileType, index) in playerTiles1"
                :key="index"
                :size="size"
                :tile-type="tileType"
                :selected="isSelectedTile(index, tileType)"
                :disabled="isDisabled(tileType)"
                class="d-inline-block me-2"
                show-pointer
                @click="selectTile(index, tileType)"
              />
            </div>
            <div class="col col-xl-12 text-start text-xl-center">
              <civilization-tile
                v-for="(tileType, index) in playerTiles2"
                :key="index"
                :size="size"
                :tile-type="tileType"
                :selected="isSelectedTile(index + 3, tileType)"
                :disabled="isDisabled(tileType)"
                class="d-inline-block me-2"
                show-pointer
                @click="selectTile(index + 3, tileType)"
              />
            </div>
          </div>
        </div>
        <div class="col-auto col-xl-12 align-self-center justify-content-center pt-xl-4">
          <civilization-tile
            v-for="index in player.catastropheTiles"
            :key="index"
            :size="size"
            :tile-type="tileTypes.catastrophe"
            :selected="isSelectedTile(index, tileTypes.catastrophe)"
            :disabled="isDisabled(tileTypes.catastrophe)"
            class="d-inline-block me-2"
            show-pointer
            @click="selectTile(index, tileTypes.catastrophe)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, type Component } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useBoardStore } from '@/stores/useBoardStore'
import { usePlayersStore } from '@/stores/usePlayersStore'
import { useLogStore } from '@/stores/useLogStore'
import CivilizationTile from './CivilizationTile.vue'
import LeaderTile from './LeaderTile.vue'
import { tileTypes, leaderTileTypes, actionTypes, breakpoints } from '@/common/constants'
import helpers from '@/common/helpers'
import type { Player } from '@/stores/usePlayersStore'
import BiSuitDiamondFill from '~icons/bi/suit-diamond-fill'
import BiStarFill from '~icons/bi/star-fill'
import BiSuitHeartFill from '~icons/bi/suit-heart-fill'
import BiEggFill from '~icons/bi/egg-fill'

// Props
interface Props {
  player?: Player
  selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
})

// Get stores
const gameStore = useGameStore()
const boardStore = useBoardStore()
const playersStore = usePlayersStore()
const logStore = useLogStore()

// Reactive state
const size = ref<number>(0)

// Computed properties from stores
const visiblePlayerId = computed(() => gameStore.visiblePlayerId)
const remainingActions = computed(() => gameStore.remainingActions)
const currentActionType = computed(() => gameStore.currentActionType)
const conflictTileType = computed(() => gameStore.conflictTileType)

// Component computed properties
const leaderIcon = computed<Component | null>(() => {
  if (!props.player) return null
  const iconMap: Record<number, Component> = {
    1: BiSuitDiamondFill,
    2: BiStarFill,
    3: BiSuitHeartFill,
    4: BiEggFill,
  }
  return iconMap[props.player.id] || null
})

const playerTiles1 = computed(() => {
  if (!props.player) return []
  const max = props.player.hand.length < 3 ? props.player.hand.length : 3
  return props.player.hand.slice(0, max)
})

const playerTiles2 = computed(() => {
  if (!props.player) return []
  if (props.player.hand.length < 4) return []
  const max = props.player.hand.length < 6 ? props.player.hand.length : 6
  return props.player.hand.slice(3, max)
})

const isInConflict = computed(
  () =>
    currentActionType.value === actionTypes.conflictAttack ||
    currentActionType.value === actionTypes.conflictDefend
)

// Methods
function setPlayerVisible() {
  if (!props.player) return
  gameStore.setVisiblePlayerId(props.player.id)
}

function isSelectedTile(index: number, tileType: number): boolean {
  if (!props.player) return false
  return (
    props.selectable &&
    props.player.selectedTiles.some((x: any) => x.index === index && x.tileType === tileType)
  )
}

function isHighlightedLeader(tileType: number): boolean {
  if (!props.player) return false
  const selectedBoardLeader = boardStore.getSelectedBoardLeader(props.player.id)
  return (
    currentActionType.value === actionTypes.playTile &&
    !!selectedBoardLeader &&
    selectedBoardLeader.tileType === tileType
  )
}

function isDisabled(tileType: number): boolean {
  return (isInConflict.value && conflictTileType.value !== tileType) || remainingActions.value === 0
}

function selectTile(index: number, tileType: number) {
  if (!props.selectable || !props.player) return

  const isLeaderTile = leaderTileTypes.includes(tileType)
  let allowTileSelection = false

  if (
    remainingActions.value > 0 &&
    currentActionType.value === actionTypes.playTile &&
    (!isLeaderTile || (isLeaderTile && props.player.leaders.includes(tileType)))
  ) {
    allowTileSelection = true
  }
  if (isInConflict.value && !isLeaderTile && props.player.hand[index] === conflictTileType.value) {
    allowTileSelection = true
  }
  if (
    currentActionType.value === actionTypes.swapTiles &&
    !isLeaderTile &&
    tileType !== tileTypes.catastrophe
  ) {
    allowTileSelection = true
  }

  // Selecting a tile in hand
  if (allowTileSelection) {
    if (isSelectedTile(index, tileType)) {
      playersStore.removeTileSelection({
        index: index,
        tileType: tileType,
        isLeaderTile: isLeaderTile,
      })
    } else {
      if (!isInConflict.value) boardStore.resetBoardTileHighlights()
      playersStore.addTileSelection({
        index: index,
        tileType: tileType,
        isLeaderTile: isLeaderTile,
      })
    }
    // Moving a leader from board to hand
  } else {
    const selectedBoardLeader = boardStore.getSelectedBoardLeader(props.player.id)
    if (
      selectedBoardLeader &&
      selectedBoardLeader.tileType === tileType &&
      currentActionType.value === actionTypes.playTile
    ) {
      gameStore.saveSnapshot()
      playersStore.addLeaderToPlayer(selectedBoardLeader)
      boardStore.removeTile({ index: selectedBoardLeader.index })
      boardStore.setRegions()
      boardStore.resetAvailableTileLocations()
      gameStore.actionCompleted()
      logStore.logActionMessage({
        playerId: props.player.id,
        text: `moved ${helpers.getLogToken(selectedBoardLeader)} from ${helpers.getCoordinatesByIndex(selectedBoardLeader.index)} back to hand`,
      })
    }
  }
}

function onWindowResize() {
  const windowWidth = window.innerWidth
  size.value = 40
  if (windowWidth <= breakpoints.medium) size.value = 30
  if (windowWidth <= breakpoints.small) size.value = 20
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', onWindowResize)
  onWindowResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style scoped>
@media (min-width: 1200px) {
  .card {
    height: 335px;
  }
}
</style>
