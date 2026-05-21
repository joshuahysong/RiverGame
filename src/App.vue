<template>
  <b-app>
    <div>
      <nav-bar @new-game="startNewGame" />
      <!-- main page -->
      <div class="main-app container-fluid text-center mb-5 p-0">
      <action-bar v-if="!showGameEnd" />
      <div
        v-if="showGameEnd"
        class="row no-gutters mt-1"
      >
        <div class="col-12 col-xl-10 offset-xl-1">
          <game-end class="m-1" />
        </div>
      </div>
      <div
        v-if="showWarBoard"
        class="row no-gutters mt-2"
      >
        <div class="col-12 col-xl-10 offset-xl-1">
          <war-board class="m-1" />
        </div>
      </div>
      <div class="row no-gutters mt-2">
        <!-- board column -->
        <div class="col-12 col-lg-9 col-xl-7 order-2 order-xl-1">
          <div class="map-container">
            <div class="grid">
              <map-square
                v-for="(mapSquare, index) in map"
                :key="index"
                class="cell"
                :map-square-type="mapSquare"
                :index="index"
                :tile="getTile(index)"
              />
            </div>
          </div>
        </div>
        <!-- player hand column -->
        <div class="col-12 col-xl-2 order-1 order-xl-2 mb-2 m-xl-0">
          <div class="row no-gutters justify-content-center align-items-center">
            <div
              v-if="showMonumentsAboveHand"
              class="col-12 col-md-6 mb-2 px-1 d-block d-lg-none"
            >
              <monument-card />
            </div>
            <div class="col-12 col-md-10 col-lg-8 col-xl-12 px-1 px-xl-0 pr-xl-3">
              <player-hand
                :player="getPlayer(actionPlayerId)"
                selectable
              />
            </div>
            <div class="col-12 mt-3 pr-3 d-none d-xl-block">
              <monument-card />
            </div>
          </div>
        </div>
        <!-- player card column -->
        <div class="col-12 col-lg-3 order-3">
          <div class="row no-gutters">
            <div
              v-for="(player, index) in allPlayers"
              :key="index"
              :class="index != 0 ? 'mt-2' : 'mt-2 mt-lg-0'"
              class="col-6 col-lg-12 px-1"
            >
              <player-card
                :player="getPlayer(player?.id)"
                :show-score="player?.id === visiblePlayerId && player?.id === actionPlayerId"
                :class="{ 'border-danger': player?.id === actionPlayerId }"
              />
            </div>
            <div class="col-6 col-lg-12 px-1 mt-2 d-block d-xl-none">
              <monument-card class="h-100" />
            </div>
            <div class="col-6 col-lg-12 px-1 mt-2">
              <progress-card />
            </div>
            <div class="col-12 px-1 mt-2">
              <game-log />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- footer -->
    <b-navbar
      type="light"
      variant="light"
      fixed="bottom"
      class="border-top py-0"
    >
      <b-navbar-nav
        class="mx-auto"
        small
      >
        <b-nav-text>Version: {{ appVersion }}</b-nav-text>
      </b-navbar-nav>
    </b-navbar>
    </div>
  </b-app>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { BApp } from 'bootstrap-vue-next'
import ActionBar from './components/ActionBar.vue'
import GameEnd from './components/GameEnd.vue'
import GameLog from './components/GameLog.vue'
import MapSquare from './components/MapSquare.vue'
import MonumentCard from './components/MonumentCard.vue'
import NavBar from './components/NavBar.vue'
import PlayerHand from './components/PlayerHand.vue'
import PlayerCard from './components/PlayerCard.vue'
import ProgressCard from './components/ProgressCard.vue'
import WarBoard from './components/WarBoard.vue'
import { actionTypes, conflictTypes } from './common/constants'
import { useBoardStore } from './stores/useBoardStore'
import { usePlayersStore } from './stores/usePlayersStore'
import { useGameStore } from './stores/useGameStore'
import { useBagStore } from './stores/useBagStore'
import { useLogStore } from './stores/useLogStore'
import { useSettingsStore } from './stores/useSettingsStore'
import type { Player } from './stores/usePlayersStore'

// Initialize stores
const boardStore = useBoardStore()
const playersStore = usePlayersStore()
const gameStore = useGameStore()
const bagStore = useBagStore()
const logStore = useLogStore()
const settingsStore = useSettingsStore()

// Computed properties from stores
const map = computed(() => boardStore.map)
const tiles = computed(() => boardStore.tiles)
const allPlayers = computed(() => playersStore.all)
const isSaveValid = computed(() => gameStore.isSaveValid)
const visiblePlayerId = computed(() => gameStore.visiblePlayerId)
const currentActionType = computed(() => gameStore.currentActionType)
const actionPlayerId = computed(() => gameStore.actionPlayerId)
const conflictType = computed(() => gameStore.conflictType)

// Computed properties
const appVersion = computed(() => import.meta.env.VITE_APP_VERSION)

const showMonumentsAboveHand = computed(() => {
  return (
    currentActionType.value === actionTypes.buildMonument ||
    currentActionType.value === actionTypes.buildMonumentMultiple
  )
})

const showWarBoard = computed(() => {
  return conflictType.value !== conflictTypes.none
})

const showGameEnd = computed(() => {
  return currentActionType.value === actionTypes.gameOver
})

// Methods
function getTile(index: number) {
  return tiles.value[index]
}

function getPlayer(id: number | undefined): Player | undefined {
  if (id === undefined) return undefined
  const matchingPlayers = allPlayers.value.filter((x) => x.id === id)
  if (matchingPlayers && matchingPlayers.length > 0) {
    return matchingPlayers[0]
  }
  return undefined
}

async function startNewGame() {
  localStorage.removeItem('gameState')
  logStore.init()
  gameStore.init()
  boardStore.init()
  bagStore.init()
  playersStore.clearPlayers()
  await playersStore.createNewPlayer({ name: 'Test Player 1', isHuman: true })
  await playersStore.createNewPlayer({ name: 'Test Player 2', isHuman: true })
  await playersStore.createNewPlayer({ name: 'Test Player 3', isHuman: true })
  await playersStore.createNewPlayer({ name: 'Test Player 4', isHuman: true })
  bagStore.setStartingBag()
  gameStore.save()
  logStore.logSystemMessage('New Game Started')
}

// Lifecycle hooks
onMounted(async () => {
  if (isSaveValid.value) {
    gameStore.load()
  } else {
    await startNewGame()
  }
  settingsStore.load()
})
</script>

<style scoped lang="scss">
.main-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.map-container {
  background: black;
  display: inline-block;
  border: 5px solid black;
}

.grid {
  display: grid;
  grid-template-columns: repeat(16, calc(50vw / 16));
  grid-template-rows: repeat(11, calc(50vw / 16));
  grid-gap: 2px;

  @media (max-width: 1199.98px) {
    grid-template-columns: repeat(16, calc(70vw / 16));
    grid-template-rows: repeat(11, calc(70vw / 16));
    grid-gap: 2px;
  }

  @media (max-width: 767.98px) {
    grid-template-columns: repeat(16, calc(90vw / 16));
    grid-template-rows: repeat(11, calc(90vw / 16));
    grid-gap: 1px;
  }
}

.cell {
  justify-content: center;
  align-items: center;
  display: flex;
}
</style>

<style lang="scss">
.pointer {
  cursor: pointer !important;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
