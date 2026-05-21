<template>
  <div
    class="tile d-inline-block"
    :class="tileClass"
    :style="tileStyle"
  >
    <b-icon
      class="h-100 w-100"
      :icon="icon"
      :class="iconClass"
    />
    <div
      v-if="showStrength"
      class="strength strength-text-size"
    >
      {{ boardStrength }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useBoardStore } from '@/stores/useBoardStore'
import helpers from '@/common/helpers'
import type { Player } from '@/stores/usePlayersStore'

// Props
interface Props {
  tileType?: number
  player?: Player
  mapIndex?: number
  selected?: boolean
  highlight?: boolean
  disabled?: boolean
  showPointer?: boolean
  size?: number
  showStrength?: boolean
  showEmpty?: boolean
}

const props = defineProps<Props>()

// Get store
const boardStore = useBoardStore()

// Computed properties
const isEmpty = computed(() =>
  props.player && props.tileType
    ? !props.player.leaders.includes(props.tileType) && props.showEmpty
    : false
)

const tileClass = computed(() => {
  let cssClass = props.selected ? 'selected' : ''
  cssClass += props.highlight ? ' highlight' : ''
  cssClass +=
    (props.showPointer && !isEmpty.value) || (isEmpty.value && props.highlight) ? ' pointer' : ''
  cssClass += props.disabled ? ' disabled' : ''
  return cssClass
})

const tileStyle = computed(() =>
  props.size ? `height: ${props.size}px; width: ${props.size}px;` : ''
)

const iconClass = computed(() => {
  let leaderClass = helpers.getTileNameByType(props.tileType || 0)
  if (isEmpty.value) leaderClass += ' empty'
  return leaderClass
})

const icon = computed(() => (props.player ? helpers.getPlayerIconNameById(props.player.id) : ''))

const boardStrength = computed(() => {
  if (props.mapIndex !== undefined && props.mapIndex >= 0 && props.tileType) {
    return boardStore.getWarBoardStrength({
      tileType: props.tileType,
      index: props.mapIndex,
    }).length
  }
  return null
})
</script>

<style lang="scss" scoped>
.tile {
  height: 90%;
  width: 90%;
  border-radius: 4px;
  z-index: 3;
}
.selected {
  box-shadow:
    0 0 0 1px white,
    0 0 0 4px red;
}
.highlight {
  box-shadow: 0 0 4px 4px yellow;
}
.king {
  color: $color-settlement;
  stroke: $color-settlement;
  stroke-width: 0;
}
.priest {
  color: $color-temple;
  stroke: $color-temple;
  stroke-width: 0;
}
.farmer {
  color: $color-farm;
  stroke: $color-farm;
  stroke-width: 0;
}
.trader {
  color: $color-market;
  stroke: $color-market;
  stroke-width: 0;
}
.empty {
  color: GhostWhite;
  stroke-width: 1px;
  stroke-dasharray: 1, 2;
  stroke-linecap: round;
}
.strength {
  position: absolute;
  top: 0%;
  left: 0%;
  align-content: center;
  color: white;
  height: 100%;
  width: 100%;
}

.strength-text-size {
  font-size: 0.75em;
}

@media (max-width: 577px) {
  .strength-text-size {
    font-size: 0.55em;
  }
}
</style>
