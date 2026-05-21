<template>
  <div>
    <div
      class="tile-monument icon-stack"
      :style="monumentStyle"
      :class="monumentClass"
    >
      <i-bi-octagon-fill
        class="icon-stack-base"
        :class="primaryTileClass"
      />
      <i-bi-octagon-fill
        class="icon-stack-overlay"
        :class="secondaryTileClass"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import helpers from '@/common/helpers'
import { tileTypes, monumentTypes } from '@/common/constants'

// Props
interface Props {
  size?: number
  selected?: boolean
  disabled?: boolean
  showPointer?: boolean
  monumentType: number
}

const props = defineProps<Props>()

// Reactive state
const primaryTileType = ref<number>(tileTypes.empty)
const secondaryTileType = ref<number>(tileTypes.empty)

// Computed properties
const primaryTileClass = computed(
  () => `${helpers.getTileNameByType(primaryTileType.value)}-monument`
)

const secondaryTileClass = computed(
  () => `${helpers.getTileNameByType(secondaryTileType.value)}-monument`
)

const monumentStyle = computed(() => {
  let style = ''
  if (props.size) style += `height: ${props.size}px; width: ${props.size}px;`
  return style
})

const monumentClass = computed(() => {
  let monumentClass = ''
  monumentClass += props.selected ? ' selected' : ''
  monumentClass += props.disabled ? ' disabled' : ''
  monumentClass += props.showPointer && !props.disabled ? ' pointer' : ''
  return monumentClass
})

// Lifecycle hooks
onMounted(() => {
  switch (props.monumentType) {
    case monumentTypes.redBlue:
      primaryTileType.value = tileTypes.temple
      secondaryTileType.value = tileTypes.farm
      break
    case monumentTypes.blueGreen:
      primaryTileType.value = tileTypes.farm
      secondaryTileType.value = tileTypes.market
      break
    case monumentTypes.greenRed:
      primaryTileType.value = tileTypes.market
      secondaryTileType.value = tileTypes.temple
      break
    case monumentTypes.blackRed:
      primaryTileType.value = tileTypes.settlement
      secondaryTileType.value = tileTypes.temple
      break
    case monumentTypes.blackGreen:
      primaryTileType.value = tileTypes.settlement
      secondaryTileType.value = tileTypes.market
      break
    case monumentTypes.blackBlue:
      primaryTileType.value = tileTypes.settlement
      secondaryTileType.value = tileTypes.farm
      break
  }
})
</script>

<style lang="scss" scoped>
@use '@/scss/variables.scss' as vars;

.selected {
  border-radius: 4px;
  box-shadow:
    0 0 0 2px white,
    0 0 0 5px red;
}
.tile-monument {
  height: 100%;
  width: 100%;
}
.icon-stack {
  display: inline-block;
  position: relative;
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
.icon-stack-base,
.icon-stack-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.icon-stack-overlay {
  width: 40%;
  height: 40%;
  left: 30%;
  top: 30%;
}
.temple-monument {
  color: vars.$color-temple;
}
.market-monument {
  color: vars.$color-market;
}
.settlement-monument {
  color: vars.$color-settlement;
}
.farm-monument {
  color: vars.$color-farm;
}
</style>

