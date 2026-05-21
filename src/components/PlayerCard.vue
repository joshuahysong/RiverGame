<template>
  <div class="card h-100">
    <div class="card-body p-2">
      <div class="row g-0 text-start small pb-2">
        <div class="col-auto pe-1">
          {{ player.name }}
        </div>
        <div
          v-if="!player.isHuman"
          class="col-auto"
        >
          (Bot)
        </div>
      </div>
      <div class="row g-0 align-items-center">
        <div class="col text-center text-sm-left">
          <leader-tile
            v-for="(leaderTileType, index) in leaderTileTypes"
            :key="index"
            :size="size"
            :tile-type="leaderTileType"
            :player="player"
            class="me-1"
            show-empty
          />
        </div>
        <div class="col-auto">
          <div class="row g-0 align-items-center">
            <div class="col-12 col-sm-auto pe-0 pe-sm-2">
              <div class="row g-0 align-items-center justify-content-center">
                <div class="col-auto pe-1">
                  <civilization-tile
                    :tile-type="tileTypes.generic"
                    :size="size"
                  />
                </div>
                <div class="col-auto small">
                  x{{ player.hand.length }}
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-auto pt-1 pt-sm-0">
              <div class="row g-0 align-items-center justify-content-center">
                <div class="col-auto pe-1">
                  <civilization-tile
                    :tile-type="tileTypes.catastrophe"
                    :size="size"
                  />
                </div>
                <div class="col-auto small">
                  x{{ player.catastropheTiles }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="showScore || debug"
        class="row g-0 mt-1 justify-content-center justify-content-lg-start"
      >
        <div class="col-auto align-self-center">
          <b-badge
            pill
            class="settlement-score me-2"
          >
            {{ player.score.settlement }}
          </b-badge>
        </div>
        <div class="col-auto align-self-center">
          <b-badge
            pill
            class="temple-score me-2"
          >
            {{ player.score.temple }}
          </b-badge>
        </div>
        <div class="col-auto align-self-center">
          <b-badge
            pill
            class="farm-score me-2"
          >
            {{ player.score.farm }}
          </b-badge>
        </div>
        <div class="col-auto align-self-center">
          <b-badge
            pill
            class="market-score me-2"
          >
            {{ player.score.market }}
          </b-badge>
        </div>
        <div class="col-auto align-self-center">
          <b-badge
            pill
            class="treasure-score me-2"
          >
            {{ player.score.treasure }}
          </b-badge>
        </div>
      </div>
      <div
        v-if="debug"
        class="row g-0 mt-1 justify-content-center justify-content-lg-start"
      >
        <civilization-tile
          v-for="(tileType, index) in player.hand"
          :key="index"
          :tile-type="tileType"
          :size="size"
          class="col-auto me-1"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import CivilizationTile from './CivilizationTile.vue'
import LeaderTile from './LeaderTile.vue'
import { tileTypes, leaderTileTypes } from '@/common/constants'
import type { Player } from '@/stores/usePlayersStore'

// Props
interface Props {
  player?: Player
  showScore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showScore: false,
})

// Get store
const gameStore = useGameStore()

// Reactive state
const size = ref<number>(25)

// Computed properties
const debug = computed(() => gameStore.debug)
</script>

<style lang="scss" scoped>
@use '@/scss/variables.scss' as vars;

.temple-score {
  background-color: vars.$color-temple;
}
.market-score {
  background-color: vars.$color-market;
}
.settlement-score {
  background-color: vars.$color-settlement;
}
.farm-score {
  background-color: vars.$color-farm;
}
.treasure-score {
  background-color: vars.$color-treasure;
}
</style>

