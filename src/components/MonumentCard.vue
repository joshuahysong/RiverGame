<template>
  <div class="card">
    <div class="card-header bg-transparent border-0 py-2">
      <strong>Monuments</strong>
    </div>
    <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
      <div class="row no-gutters align-items-center">
        <div class="col-6 col-lg-12 text-right text-lg-center">
          <monument-tile
            v-for="monumentType in monumentTypes1"
            :key="monumentType"
            :size="size"
            :monument-type="monumentType"
            :selected="isSelectedMonument(monumentType)"
            :disabled="!isAvailableMonument(monumentType)"
            class="d-inline-block mr-2 mb-1"
            :show-pointer="isBuildingMonument"
            @click="selectMonument(monumentType)"
          />
        </div>
        <div class="col-6 col-lg-12 text-left text-lg-center">
          <monument-tile
            v-for="monumentType in monumentTypes2"
            :key="monumentType"
            :size="size"
            :monument-type="monumentType"
            :selected="isSelectedMonument(monumentType)"
            :disabled="!isAvailableMonument(monumentType)"
            class="d-inline-block mr-2 mb-1"
            :show-pointer="isBuildingMonument"
            @click="selectMonument(monumentType)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useBoardStore } from '@/stores/useBoardStore'
import MonumentTile from './MonumentTile.vue'
import { actionTypes, breakpoints, tileTypes, monumentTypes } from '@/common/constants'

// Get stores
const gameStore = useGameStore()
const boardStore = useBoardStore()

// Reactive state
const size = ref<number>(0)

// Computed properties from stores
const currentActionType = computed(() => gameStore.currentActionType)
const remainingMonuments = computed(() => gameStore.remainingMonuments)
const selectedMonumentType = computed(() => gameStore.selectedMonumentType)
const availableMonumentLocations = computed(() => boardStore.availableMonumentLocations)

// Component computed properties
const monumentTypes1 = computed(() => {
  const max = remainingMonuments.value.length < 3 ? remainingMonuments.value.length : 3
  return remainingMonuments.value.slice(0, max)
})

const monumentTypes2 = computed(() => {
  if (remainingMonuments.value.length < 4) return []
  const max = remainingMonuments.value.length < 6 ? remainingMonuments.value.length : 6
  return remainingMonuments.value.slice(3, max)
})

const isBuildingMonument = computed(
  () =>
    currentActionType.value === actionTypes.buildMonument ||
    currentActionType.value === actionTypes.buildMonumentMultiple
)

// Methods
function isSelectedMonument(monumentType: number): boolean {
  return isBuildingMonument.value && selectedMonumentType.value === monumentType
}

function isAvailableMonument(monumentType: number): boolean {
  if (!isBuildingMonument.value) return true

  if (availableMonumentLocations.value && availableMonumentLocations.value.length > 0) {
    if (
      monumentTypes.redMonuments.some((x: number) => x === monumentType) &&
      availableMonumentLocations.value.some((x: any) => x.tileType === tileTypes.temple)
    )
      return true
    if (
      monumentTypes.blueMonuments.some((x: number) => x === monumentType) &&
      availableMonumentLocations.value.some((x: any) => x.tileType === tileTypes.farm)
    )
      return true
    if (
      monumentTypes.greenMonuments.some((x: number) => x === monumentType) &&
      availableMonumentLocations.value.some((x: any) => x.tileType === tileTypes.market)
    )
      return true
    if (
      monumentTypes.blackMonuments.some((x: number) => x === monumentType) &&
      availableMonumentLocations.value.some((x: any) => x.tileType === tileTypes.settlement)
    )
      return true
  }

  return false
}

function selectMonument(monumentType: number) {
  if (isBuildingMonument.value && isAvailableMonument(monumentType)) {
    gameStore.setSelectedMonumentType(monumentType)

    if (availableMonumentLocations.value.length === 1) {
      boardStore.buildMonument({
        index: availableMonumentLocations.value[0].index,
        monumentType: monumentType,
      })
    } else if (availableMonumentLocations.value.length > 1) {
      availableMonumentLocations.value.forEach((location: any) => {
        const tile = boardStore.tile(location.index)
        boardStore.updateTile({ ...tile, isHighlighted: true })
        gameStore.setActionType(actionTypes.buildMonumentMultiple)
      })
    }
  }
}

function onWindowResize() {
  const windowWidth = window.innerWidth
  size.value = 40
  if (windowWidth <= breakpoints.medium) size.value = 35
  if (windowWidth <= breakpoints.small) size.value = 30
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
