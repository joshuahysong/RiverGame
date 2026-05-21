<template>
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    focusable="false"
    role="img"
    :aria-label="ariaLabel"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    :class="computedClass"
    :style="computedStyle"
    v-bind="$attrs"
  >
    <g v-html="iconPath" />
  </svg>
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
  stacked?: boolean
}>()

// Map of icon names to their SVG paths (from Bootstrap Icons)
const iconPaths: Record<string, string> = {
  'suit-diamond-fill': '<path d="M2.45 7.4 7.2 1.067a1 1 0 0 1 1.6 0L13.55 7.4a1 1 0 0 1 0 1.2L8.8 14.933a1 1 0 0 1-1.6 0L2.45 8.6a1 1 0 0 1 0-1.2z"/>',
  'star-fill': '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>',
  'suit-heart-fill': '<path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>',
  'egg-fill': '<path d="M14 10a6 6 0 0 1-12 0C2 5.686 5 0 8 0s6 5.686 6 10z"/>',
  'square-fill': '<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>',
  'octagon-fill': '<path d="M11.107 0a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146A.5.5 0 0 1 4.893 0h6.214z"/>',
  'circle-fill': '<circle cx="8" cy="8" r="8"/>',
  'triangle-fill': '<path d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/>',
  'x-square': '<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>',
}

const iconPath = computed(() => {
  if (!props.icon) return ''
  return iconPaths[props.icon] || ''
})

const ariaLabel = computed(() => props.icon?.replace(/-/g, ' ') || 'icon')

const computedClass = computed(() => {
  const classes = ['b-icon', 'bi']
  
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
  
  const transforms: string[] = []
  
  if (props.rotate) {
    transforms.push(`rotate(${props.rotate}deg)`)
  }
  
  if (props.flipH) {
    transforms.push('scaleX(-1)')
  }
  
  if (props.flipV) {
    transforms.push('scaleY(-1)')
  }
  
  if (transforms.length > 0) {
    styles.transform = transforms.join(' ')
  }
  
  return styles
})
</script>

<style scoped>
.b-icon-font {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
