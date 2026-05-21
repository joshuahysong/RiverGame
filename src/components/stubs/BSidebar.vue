<template>
  <div v-if="modelValue" v-bind="$attrs">
    <div
      class="offcanvas offcanvas-end show"
      :class="{ 'offcanvas-backdrop': backdrop }"
      tabindex="-1"
    >
      <div class="offcanvas-header">
        <h5 v-if="title" class="offcanvas-title">{{ title }}</h5>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="emit('update:modelValue', false)"
        ></button>
      </div>
      <div class="offcanvas-body">
        <slot />
      </div>
    </div>
    <div
      v-if="backdrop"
      class="offcanvas-backdrop fade show"
      @click="emit('update:modelValue', false)"
    ></div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue?: boolean
  title?: string
  backdrop?: boolean
  right?: boolean
  noCloseOnBackdrop?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
