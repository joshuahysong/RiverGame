<template>
  <div class="b-iconstack" v-bind="$attrs">
    <slot />
  </div>
</template>

<script lang="ts" setup>
// Simple wrapper for stacking icons
</script>

<style scoped>
.b-iconstack {
  display: inline-block;
  position: relative;
  width: 1em;
  height: 1em;
  vertical-align: middle;
}

.b-iconstack :deep(i) {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
