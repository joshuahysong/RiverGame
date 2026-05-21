<template>
    <div class="map-square ground"
        :class="getMapSquareClass()"
        @click="doMapSquareClick">
        <civilization-tile v-if="hasTile && !tile.isLeaderTile"
            :tile-type="tile.tileType"
            :highlight="tile.isHighlighted"
            :has-treasure="tile.hasTreasure"
            :is-conflict-tile="isConflictTile" />
        <leader-tile v-if="hasTile && tile.isLeaderTile"
            :tile-type="tile.tileType"
            :map-index="index"
            :highlight="tile.isHighlighted"
            :player="getPlayer()"
            :show-pointer="showLeaderPointer"
            :show-strength="showLeaderStrength" />
        <monument-tile v-if="showMonument" :monumentType="tile.monumentType" class="monument"/>
        <div v-if="isRiverTile && riverPath === '='" class="river river-horizontal"></div>
        <div v-if="isRiverTile && riverPath === '║'" class="river river-vertical"></div>
        <div v-if="isRiverTile && showRiverHorizontalLeft" class="river river-horizontal-left"></div>
        <div v-if="isRiverTile && showRiverHorizontalRight" class="river river-horizontal-right"></div>
        <div v-if="isRiverTile && showRiverVerticalBottom" class="river river-vertical-bottom"></div>
        <div v-if="isRiverTile && showRiverVerticalTop" class="river river-vertical-top"></div>
        <div v-if="showKingdoms" class="kingdom" :style="kingdomStyle"></div>
        <div v-if="showCoordinates"
            class="coordinates coordinates-text-size"
            :class="{'text-white': hasTile, 'pointer': ((tile && tile.isHighlighted || showLeaderPointer))}" >
            {{coordinates}}
        </div>
        <div v-if="showIndexes && debug"
            class="coordinates coordinates-text-size d-flex justify-content-center"
            :class="{'text-white': hasTile, 'pointer': ((tile && tile.isHighlighted || showLeaderPointer))}">
            <span class="align-self-end">{{index}}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useBoardStore } from '@/stores/useBoardStore'
import { usePlayersStore } from '@/stores/usePlayersStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import CivilizationTile from './CivilizationTile.vue'
import LeaderTile from './LeaderTile.vue'
import MonumentTile from './MonumentTile.vue'
import helpers from '@/common/helpers'
import { mapTypes, tileTypes, actionTypes } from '@/common/constants'
import type { Player } from '@/stores/usePlayersStore'

// Props
interface Props {
  mapSquareType?: number
  index?: number
  tile?: any
}

const props = defineProps<Props>()

// Get stores
const gameStore = useGameStore()
const boardStore = useBoardStore()
const playersStore = usePlayersStore()
const settingsStore = useSettingsStore()

// Reactive state
const isPriorityTreasureSquare = ref<boolean>(false)
const isRiverTile = ref<boolean>(false)
const riverPath = ref<string | null>(null)

// Computed properties from stores
const showKingdoms = computed(() => settingsStore.showKingdoms)
const showCoordinates = computed(() => settingsStore.showCoordinates)
const showIndexes = computed(() => settingsStore.showIndexes)
const showLeaderStrength = computed(() => settingsStore.showLeaderStrength)
const currentPlayer = computed(() => playersStore.currentPlayer)
const debug = computed(() => gameStore.debug)
const currentActionType = computed(() => gameStore.currentActionType)
const actionPlayerId = computed(() => gameStore.actionPlayerId)
const visiblePlayerId = computed(() => gameStore.visiblePlayerId)
const conflictTile = computed(() => boardStore.conflictTile)

// Component computed properties
const coordinates = computed(() => 
  props.index !== undefined ? helpers.getCoordinatesByIndex(props.index) : ''
)

const hasTile = computed(() => 
  props.tile && props.tile.tileType !== tileTypes.empty
)

const showRiverHorizontalLeft = computed(() => 
  riverPath.value === '╗' || riverPath.value === '╝'
)

const showRiverHorizontalRight = computed(() => 
  riverPath.value === '╔' || riverPath.value === '╚'
)

const showRiverVerticalBottom = computed(() => 
  riverPath.value === '╔' || riverPath.value === '╗'
)

const showRiverVerticalTop = computed(() => 
  riverPath.value === '╚' || riverPath.value === '╝'
)

const kingdomStyle = computed(() => {
  const blankCss = 'background-color: transparent;'
  if (!hasTile.value || props.index === undefined) return blankCss
  
  const kingdomIndex = boardStore.getKingdomIndex(props.index)
  const colors = [
    'FF0000', 'FFFF00', '00EAFF', 'AA00FF', 'FF7F00', 'BFFF00',
    '0095FF', 'FF00AA', 'FFD400', '6AFF00', '0040FF', 'EDB9B9',
    'B9D7ED', 'E7E9B9', 'DCB9ED', 'B9EDE0', '8F2323', '23628F',
    '8F6A23', '6B238F', '4F8F23', '000000', '737373', 'CCCCCC'
  ]
  
  return kingdomIndex !== null && kingdomIndex >= 0 ? `background-color: #${colors[kingdomIndex]};` : blankCss
})

const showMonument = computed(() =>
  props.tile &&
  props.tile.monumentType &&
  props.tile.tileType === tileTypes.monumentBottomRight
)

const showLeaderPointer = computed(() =>
  currentPlayer.value && props.tile &&
  currentPlayer.value.id === props.tile.playerId &&
  currentActionType.value === actionTypes.playTile
)

const isConflictTile = computed(() =>
  !!(conflictTile.value && props.index !== undefined && 
  conflictTile.value.index === props.index)
)

// Methods
function getMapSquareClass(): string {
  let mapClass = ''
  const availableTileLocations = boardStore.getAvailableTileLocations
  
  if (Array.isArray(availableTileLocations) && props.index !== undefined && 
      availableTileLocations.includes(props.index)) {
    mapClass += ' valid-location'
  }
  
  if (isPriorityTreasureSquare.value && props.tile && props.tile.hasTreasure) {
    mapClass += ' priority-treasure'
  }
  
  return mapClass
}

function doMapSquareClick() {
  if (actionPlayerId.value === visiblePlayerId.value) {
    boardStore.handleBoardClick(props.tile)
  }
}

function getPlayer(): Player | undefined {
  if (!props.tile?.playerId) return undefined
  const player = playersStore.getPlayer(props.tile.playerId)
  return player === null ? undefined : player
}

// Lifecycle hooks
onMounted(() => {
  isRiverTile.value = props.mapSquareType === mapTypes.river
  isPriorityTreasureSquare.value = props.mapSquareType === mapTypes.priorityTreasure
  
  if (isRiverTile.value && props.index !== undefined) {
    riverPath.value = boardStore.getRiverPath(props.index)
  }
})
</script>

<style scoped>
    .ground {
        background: BurlyWood;
    }

    .water {
        background: PaleTurquoise;
    }

    .valid-location {
        box-shadow: inset -1px -1px 100px 100px rgb(0 255 255 / 35%);
    }

    .priority-treasure {
        box-shadow: inset 0px 0px 0px 10px white
    }

    .map-square {
        position: relative;
    }

    .coordinates {
        cursor: default;
        height: 95%;
        width: 100%;
        position: absolute;
        z-index: 5;
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
    }

    .coordinates-text-size {
        font-size: 0.65em;
    }

    @media (max-width: 577px) {
        .coordinates-text-size {
            font-size: 0.45em;
        }
    }

    .river {
        background: PaleTurquoise;
        position: absolute;
        z-index: 2;
    }

    .river-horizontal {
        top: 25%;
        height: 50%;
        width: 100%;
    }

    .river-vertical {
        left: 25%;
        height: 100%;
        width: 50%;
    }

    .river-horizontal-right {
        height: 50%;
        width: 75%;
        right: 0;
    }

    .river-horizontal-left {
        height: 50%;
        width: 75%;
        left: 0;
    }

    .river-vertical-top {
        height: 75%;
        width: 50%;
        top: 0;
    }

    .river-vertical-bottom {
        height: 75%;
        width: 50%;
        bottom: 0;
    }

    .kingdom {
        height: 100%;
        width: 100%;
        position: absolute;
        opacity: 30%;
        z-index: 1;
    }

    .monument {
        height: calc(140% + 2px);
        width: calc(140% + 2px);
        bottom: 30%;
        right: 30%;
        position: absolute;
        padding: 2px;
        z-index: 4;
    }

    @media (max-width: 767.98px) {
        .monument {
            height: calc(140%);
            width: calc(140%);
            bottom: 30%;
            right: 30%;
            position: absolute;
            padding: 2px;
            z-index: 4;
        }
    }
</style>