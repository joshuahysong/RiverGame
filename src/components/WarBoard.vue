<template>
  <div class="card">
    <div class="card-body p-0">
      <div class="row g-0 align-items-center">
        <div
          v-if="conflictAttackerLeader"
          class="col-12 col-sm-6 text-start border-bottom border-end hide-border pb-1 pb-md-2 px-2 pe-sm-0 ps-sm-2"
          :class="getResultClass(conflictAttackerLeader)"
        >
          <div class="row g-0 text-center pt-2">
            <div class="col">
              <strong>Attacker</strong>
            </div>
          </div>
          <div class="row g-0 align-items-center pb-2 pe-sm-1">
            <div class="col-2" />
            <div class="col-5 small">
              <strong>Board</strong>
            </div>
            <div class="col-5 small">
              <strong>Committed</strong>
            </div>
          </div>
          <div class="row g-0 align-items-center pe-sm-1">
            <div class="col-2">
              <div class="row g-0 align-items-center">
                <div class="col-auto pe-1">
                  <leader-tile
                    :size="size"
                    :tile-type="conflictAttackerLeader.tileType"
                    :player="getPlayer(conflictAttackerLeader.playerId)"
                  />
                </div>
                <div class="col-auto text-start pe-1">
                  {{ conflictAttackerBoardTiles.length + conflictAttackerTiles.length }}
                </div>
              </div>
            </div>
            <div class="col-5">
              <div class="row g-0 justify-content-start">
                <civilization-tile
                  v-for="(tile, index) in conflictAttackerBoardTiles"
                  :key="index"
                  :tile-type="tile.tileType"
                  :size="size"
                  class="col-auto me-1 mb-1"
                />
              </div>
            </div>
            <div class="col-5">
              <div class="row g-0 justify-content-start">
                <civilization-tile
                  v-for="(tile, index) in conflictAttackerTiles"
                  :key="index"
                  :tile-type="tile.tileType"
                  :size="size"
                  class="col-auto me-1 mb-1"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="conflictDefenderLeader"
          class="col-12 col-sm-6 text-start text-sm-right pb-1 pb-md-2 px-2 ps-sm-0 pe-sm-2"
          :class="getResultClass(conflictDefenderLeader)"
        >
          <div class="row g-0 text-center pt-2">
            <div class="col">
              <strong>Defender</strong>
            </div>
          </div>
          <div class="row g-0 align-items-center pb-2 ps-sm-1">
            <div class="col-5 order-3 order-sm-1 small">
              <strong>Committed</strong>
            </div>
            <div class="col-5 order-2 small">
              <strong>Board</strong>
            </div>
            <div class="col-2 order-1 order-sm-3" />
          </div>
          <div class="row g-0 align-items-center ps-sm-1">
            <div class="col-5 order-3 order-sm-1">
              <div class="row g-0 justify-content-start justify-content-sm-end">
                <civilization-tile
                  v-for="(tile, index) in conflictDefenderTiles"
                  :key="index"
                  :tile-type="tile.tileType"
                  :size="size"
                  class="col-auto me-1 me-sm-0 ms-0 ms-sm-1 mb-1"
                />
              </div>
            </div>
            <div class="col-5 order-2">
              <div class="row g-0 justify-content-start justify-content-sm-end">
                <civilization-tile
                  v-for="(tile, index) in conflictDefenderBoardTiles"
                  :key="index"
                  :tile-type="tile.tileType"
                  :size="size"
                  class="col-auto me-1 me-sm-0 ms-0 ms-sm-1 mb-1"
                />
              </div>
            </div>
            <div class="col-2 order-1 order-sm-3">
              <div
                class="row g-0 align-items-center justify-content-start justify-content-sm-end"
              >
                <div class="col-auto text-end pe-1 pe-sm-0 ps-0 ps-sm-1 order-2 order-sm-1">
                  {{ conflictDefenderBoardTiles.length + conflictDefenderTiles.length }}
                </div>
                <div class="col-auto pe-1 pe-sm-0 ps-0 ps-sm-1 order-1 order-sm-2">
                  <leader-tile
                    :size="size"
                    :tile-type="conflictDefenderLeader.tileType"
                    :player="getPlayer(conflictDefenderLeader.playerId)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="conflictWinnerPlayerId"
      class="card-footer bg-white p-2 small"
    >
      <div class="row g-0 align-items-center justify-content-center">
        <div class="col-auto">
          <span class="me-3"><strong>{{ getPlayer(conflictWinnerPlayerId)?.name }}</strong> wins the conflict!</span>
        </div>
        <div class="col-auto">
          <b-button
            variant="success"
            size="sm"
            @click="closeWarBoard"
          >
            Continue
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { usePlayersStore } from '@/stores/usePlayersStore'
import { breakpoints, conflictTypes } from '@/common/constants'
import CivilizationTile from './CivilizationTile.vue'
import LeaderTile from './LeaderTile.vue'
import type { Player } from '@/stores/usePlayersStore'

// Get stores
const gameStore = useGameStore()
const playersStore = usePlayersStore()

// Reactive state
const size = ref<number>(0)

// Computed properties from stores
const conflictAttackerLeader = computed(() => gameStore.conflictAttackerLeader)
const conflictDefenderLeader = computed(() => gameStore.conflictDefenderLeader)
const conflictAttackerTiles = computed(() => gameStore.conflictAttackerTiles)
const conflictDefenderTiles = computed(() => gameStore.conflictDefenderTiles)
const conflictAttackerBoardTiles = computed(() => gameStore.conflictAttackerBoardTiles)
const conflictDefenderBoardTiles = computed(() => gameStore.conflictDefenderBoardTiles)
const conflictWinnerPlayerId = computed(() => gameStore.conflictWinnerPlayerId)

// Methods
function onWindowResize() {
  const windowWidth = window.innerWidth
  size.value = 30
  if (windowWidth <= breakpoints.medium) size.value = 25
  if (windowWidth <= breakpoints.small) size.value = 20
}

function getPlayer(playerId: number): Player | undefined {
  const player = playersStore.getPlayer(playerId)
  return player === null ? undefined : player
}

function closeWarBoard() {
  gameStore.resetConflictData()
  gameStore.setConflictType(conflictTypes.none)
}

function getResultClass(leader: any): string {
  if (!conflictWinnerPlayerId.value) return ''
  if (leader.playerId === conflictWinnerPlayerId.value) return 'winner'
  return 'loser'
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
.winner {
  background-color: #c9e9d1;
}

.loser {
  background-color: #f6ccd1;
}

@media (max-width: 576px) {
  .hide-border {
    border-end: none !important;
  }
}

@media (min-width: 576px) {
  .hide-border {
    border-bottom: none !important;
  }
}
</style>
