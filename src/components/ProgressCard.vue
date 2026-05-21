<template>
  <div class="card">
    <div class="card-header bg-transparent border-0 py-2">
      <strong>Progress</strong>
    </div>
    <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
      <div class="row g-0">
        <div class="col-12 col-sm-4 small">
          Bag
        </div>
        <div class="col-12 col-sm">
          <b-progress
            max="100"
            height="1.5rem"
          >
            <div
              class="progress-foreground progress-bar bg-success"
              :style="`clip-path: inset(0 ${100 - Math.round((bagSpaceRemaining / 100) * 100)}% 0 0);`"
              aria-hidden="true"
            >
              {{ Math.round((bagSpaceRemaining / 100) * 100) }}%
            </div>
            <div
              class="progress-background"
              :style="`clip-path: inset(0 0 0 ${Math.round((bagSpaceRemaining / 100) * 100)}%);`"
              aria-hidden="true"
            >
              {{ Math.round((bagSpaceRemaining / 100) * 100) }}%
            </div>
          </b-progress>
        </div>
      </div>
      <div class="row g-0 mt-2">
        <div class="col-12 col-sm-4 small">
          Treasures
        </div>
        <div class="col-12 col-sm">
          <b-progress
            :max="initialTreasures"
            height="1.5rem"
          >
            <div
              class="progress-foreground progress-bar bg-success"
              :style="`clip-path: inset(0 ${((initialTreasures - remainingTreasures) / initialTreasures) * 100}% 0 0);`"
              aria-hidden="true"
            >
              {{ remainingTreasures }} of {{ initialTreasures }}
            </div>
            <div
              class="progress-background"
              :style="`clip-path: inset(0 0 0 ${(remainingTreasures / initialTreasures) * 100}%);`"
              aria-hidden="true"
            >
              {{ remainingTreasures }} of {{ initialTreasures }}
            </div>
          </b-progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useBagStore } from '@/stores/useBagStore'
import { useBoardStore } from '@/stores/useBoardStore'

// Get stores
const bagStore = useBagStore()
const boardStore = useBoardStore()

// Computed properties from stores
const bagSpaceRemaining = computed(() => bagStore.bagSpaceRemaining)
const initialTreasures = computed(() => boardStore.initialTreasures)
const remainingTreasures = computed(() => boardStore.remainingTreasures)
</script>

<style scoped>
.progress-foreground {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: white;
}

.progress-background {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: black;
}
</style>
