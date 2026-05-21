<template>
  <div
    class="tile"
    :class="tileClass"
    :style="tileStyle"
  >
    <div
      v-if="hasTreasure"
      class="treasure-icon"
      :style="treasureStyle"
    />
    <div
      v-if="isConflictTile"
      class="conflict-tile text-dark bg-warning"
    >
      <b-icon
        icon="x-square"
        class="w-100 h-100 light"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { tileTypes, breakpoints } from '@/common/constants'
import helpers from '@/common/helpers'

// Props
interface Props {
  tileType?: number
  selected?: boolean
  highlight?: boolean
  disabled?: boolean
  hasTreasure?: boolean
  showPointer?: boolean
  isConflictTile?: boolean
  size?: number
}

const props = defineProps<Props>()

// Reactive state
const calculatedSize = ref<number>(0)

// Computed properties
const tileClass = computed(() => {
  let cssClass = helpers.getTileNameByType(props.tileType || 0)
  cssClass += props.selected ? ' selected' : ''
  cssClass += props.highlight ? ' highlight' : ''
  cssClass += props.showPointer || props.highlight ? ' pointer' : ''
  cssClass += props.disabled ? ' disabled' : ''
  return cssClass
})

const tileStyle = computed(() => {
  let style = ''
  const size = props.size ? props.size : calculatedSize.value
  if (props.size) style += `height: ${size}px; width: ${size}px;`
  if (props.tileType === tileTypes.catastrophe) {
    style += `background: repeating-linear-gradient(`
    style += `135deg,`
    style += `#eed202,`
    style += `#eed202 ${size / 4}px,`
    style += `black ${size / 4}px,`
    style += `black ${size / 2}px);`
  }
  return style
})

const treasureStyle = computed(() => {
  let style = 'top: 32.5%; left: 32.5%;'
  if (props.tileType === tileTypes.monumentBottomLeft) style = 'top: 40%; left: 20%;'
  if (props.tileType === tileTypes.monumentBottomRight) style = 'top: 40%; left: 40%;'
  if (props.tileType === tileTypes.monumentTopLeft) style = 'top: 20%; left: 20%;'
  if (props.tileType === tileTypes.monumentTopRight) style = 'top: 20%; left: 40%;'
  return style
})

// Methods
function onWindowResize() {
  const windowWidth = window.innerWidth
  calculatedSize.value = 50
  if (windowWidth <= breakpoints.large) calculatedSize.value = 40
  if (windowWidth <= breakpoints.medium) calculatedSize.value = 30
  if (windowWidth <= breakpoints.small) calculatedSize.value = 20
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

<style lang="scss" scoped>
.tile {
  height: 90%;
  width: 90%;
  border-radius: 4px;
  z-index: 3;
}

.selected {
  box-shadow: 0px 0px 0 4px red;
}

.highlight {
  box-shadow: 0 0 4px 4px yellow;
}

.temple {
  background: $color-temple;
}

.market {
  background: $color-market;
}

.settlement {
  background: $color-settlement;
}

.farm {
  background: $color-farm;
}

.generic {
  background: $color-generic;
}

.treasure-icon {
  height: 35%;
  width: 35%;
  background-color: gold;
  border-radius: 50%;
  position: absolute;
}

.conflict-tile {
  height: 90%;
  width: 90%;
  border-radius: 4px;
  position: absolute;
}

.monument-top-left {
  background-color: $color-generic;
}

.monument-top-right {
  background-color: $color-generic;
}

.monument-bottom-left {
  background-color: $color-generic;
}

.monument-bottom-right {
  background-color: $color-generic;
}
</style>
