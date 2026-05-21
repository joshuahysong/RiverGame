<template>
  <div
    class="tile d-inline-block"
    :class="tileClass"
    :style="tileStyle"
  >
    <component
      v-if="icon"
      :is="icon"
      class="h-100 w-100"
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
import { computed, type Component } from 'vue'
import { useBoardStore } from '@/stores/useBoardStore'
import helpers from '@/common/helpers'
import type { Player } from '@/stores/usePlayersStore'
import BiSuitDiamondFill from '~icons/bi/suit-diamond-fill'
import BiStarFill from '~icons/bi/star-fill'
import BiSuitHeartFill from '~icons/bi/suit-heart-fill'
import BiEggFill from '~icons/bi/egg-fill'

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

const tileStyle = computed(() =>{
    return props.size ? `height: ${props.size}px; width: ${props.size}px;` : ''
}
)

const iconClass = computed(() => {
  let leaderClass = helpers.getTileNameByType(props.tileType || 0)
  if (isEmpty.value) leaderClass += ' empty'
  return leaderClass
})

const icon = computed<Component | null>(() => {
  if (!props.player) return null
  const iconMap: Record<number, Component> = {
    1: BiSuitDiamondFill,
    2: BiStarFill,
    3: BiSuitHeartFill,
    4: BiEggFill,
  }
  return iconMap[props.player.id] || null
})

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
@use '@/scss/variables.scss' as vars;

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
  color: vars.$color-settlement;
  stroke: vars.$color-settlement;
  stroke-width: 0;
}
.priest {
  color: vars.$color-temple;
  stroke: vars.$color-temple;
  stroke-width: 0;
}
.farmer {
  color: vars.$color-farm;
  stroke: vars.$color-farm;
  stroke-width: 0;
}
.trader {
  color: vars.$color-market;
  stroke: vars.$color-market;
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

