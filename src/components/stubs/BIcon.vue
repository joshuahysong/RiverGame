<template>
  <i
    :class="computedClass"
    :style="computedStyle"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  icon?: string
  variant?: string
  scale?: number | string
  animation?: string
  rotate?: number | string
  flipH?: boolean
  flipV?: boolean
}>()

const computedClass = computed(() => {
  const classes = []
  
  if (props.icon) {
    classes.push(`bi-${props.icon}`)
  }
  
  if (props.variant) {
    classes.push(`text-${props.variant}`)
  }
  
  if (props.animation) {
    classes.push(`b-icon-animation-${props.animation}`)
  }
  
  return classes.join(' ')
})

const computedStyle = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.scale) {
    styles.fontSize = `${props.scale}em`
  }
  
  if (props.rotate) {
    styles.transform = `rotate(${props.rotate}deg)`
  }
  
  if (props.flipH || props.flipV) {
    const transforms = []
    if (props.flipH) transforms.push('scaleX(-1)')
    if (props.flipV) transforms.push('scaleY(-1)')
    styles.transform = transforms.join(' ')
  }
  
  return styles
})
</script>
