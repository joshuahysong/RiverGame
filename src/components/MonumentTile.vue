<template>
    <div>
        <b-iconstack class="tile-monument" :style="monumentStyle" :class="monumentClass">
            <b-icon stacked icon="octagon-fill" :class="primaryTileClass"></b-icon>
            <b-icon stacked icon="octagon-fill" scale="0.4" :class="secondaryTileClass"></b-icon>
        </b-iconstack>
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
const primaryTileClass = computed(() => 
  `${helpers.getTileNameByType(primaryTileType.value)}-monument`
)

const secondaryTileClass = computed(() => 
  `${helpers.getTileNameByType(secondaryTileType.value)}-monument`
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
    .selected {
        border-radius: 4px;
        box-shadow: 0 0 0 2px white, 0 0 0 5px red;
    }
    .tile-monument {
        height: 100%;
        width: 100%;
    }
    .temple-monument {
        color: $color-temple;
    }
    .market-monument {
        color: $color-market;
    }
    .settlement-monument {
        color: $color-settlement;
    }
    .farm-monument {
        color: $color-farm;
    }
</style>