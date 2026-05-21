<template>
  <div>
    <b-navbar
      toggleable="sm"
      type="dark"
      variant="dark"
      sticky
    >
      <b-button
        size="sm"
        @click="$emit('new-game')"
      >
        New Game
      </b-button>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template #button-content>
            <i-bi-gear-fill />
          </template>
          <b-dropdown-form
            form-class="px-3"
            style="width: 200px"
          >
            <b-form-checkbox
              v-model="showCoordinates"
              class="small"
              @change="saveSettings"
            >
              Show Coordinates
            </b-form-checkbox>
            <b-form-checkbox
              v-if="debug"
              v-model="showIndexes"
              class="small"
              @change="saveSettings"
            >
              Show Indexes
            </b-form-checkbox>
            <b-form-checkbox
              v-model="showKingdoms"
              class="small"
              @change="saveSettings"
            >
              Show Kingdoms
            </b-form-checkbox>
            <b-form-checkbox
              v-model="showLogTimestamps"
              class="small"
              @change="saveSettings"
            >
              Show Log Timestamps
            </b-form-checkbox>
            <b-form-checkbox
              v-model="showLeaderStrength"
              class="small"
              @change="saveSettings"
            >
              Show Leader Strength
            </b-form-checkbox>
          </b-dropdown-form>
        </b-nav-item-dropdown>
        <b-button
          v-if="debug"
          size="sm"
          class="my-2 my-sm-0 mx-2"
          @click="showDebugSidebar = true"
        >
          Debug
        </b-button>
      </b-navbar-nav>
    </b-navbar>
    <b-offcanvas
      v-model="showDebugSidebar"
      placement="end"
      shadow
      class="text-left"
    >
      <template #title>Debug Info</template>
      <div class="px-3 py-2">
        Number of Players: {{ numberOfPlayers }}<br>
        Current Action Type: {{ actionTypeName }}<br>
        Current Turn PlayerId: {{ turnPlayerId }}<br>
        Current Visible PlayerId: {{ visiblePlayerId }}<br>
        Current Action PlayerId: {{ actionPlayerId }}<br>
        Bag: {{ debugBagStats }}<br>
      </div>
    </b-offcanvas>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useBagStore } from '@/stores/useBagStore'
import { useGameStore } from '@/stores/useGameStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import helpers from '@/common/helpers'

// Emits
const emit = defineEmits<{
  'new-game': []
}>()

// Local state
const showDebugSidebar = ref(false)

// Get stores
const bagStore = useBagStore()
const gameStore = useGameStore()
const settingsStore = useSettingsStore()

// Computed properties from stores
const debugBagStats = computed(() => bagStore.debugBagStats)
const debug = computed(() => gameStore.debug)
const isSaveValid = computed(() => gameStore.isSaveValid)
const numberOfPlayers = computed(() => gameStore.numberOfPlayers)
const turnPlayerId = computed(() => gameStore.turnPlayerId)
const visiblePlayerId = computed(() => gameStore.visiblePlayerId)
const currentActionType = computed(() => gameStore.currentActionType)
const actionPlayerId = computed(() => gameStore.actionPlayerId)
const conflictType = computed(() => gameStore.conflictType)

// Computed properties with getter/setter for v-model
const showCoordinates = computed({
  get: () => settingsStore.showCoordinates,
  set: (value: boolean) => settingsStore.setShowCoordinates(value),
})

const showIndexes = computed({
  get: () => settingsStore.showIndexes,
  set: (value: boolean) => settingsStore.setShowIndexes(value),
})

const showKingdoms = computed({
  get: () => settingsStore.showKingdoms,
  set: (value: boolean) => settingsStore.setShowKingdoms(value),
})

const showLogTimestamps = computed({
  get: () => settingsStore.showLogTimestamps,
  set: (value: boolean) => settingsStore.setShowLogTimestamps(value),
})

const showLeaderStrength = computed({
  get: () => settingsStore.showLeaderStrength,
  set: (value: boolean) => settingsStore.setShowLeaderStrength(value),
})

const actionTypeName = computed(() => helpers.getActionNameByType(currentActionType.value))

// Methods
function saveSettings() {
  settingsStore.save()
}
</script>
