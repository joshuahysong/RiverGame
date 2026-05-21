<template>
  <div class="card">
    <div class="card-header bg-transparent border-0 py-2">
      <strong>Log</strong>
    </div>
    <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
      <div class="scroll border text-start p-2 small">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="log"
          :class="getClass(message)"
        >
          <span v-if="showLogTimestamps">{{ message.timestamp }}: </span><component
            v-if="message.playerId !== undefined && message.playerId >= 0 && getLeaderIcon(message)"
            :is="getLeaderIcon(message)"
            class="me-1"
          />
          <span
            v-for="(word, index) in message.text.split(' ')"
            :key="index"
          >
            <template v-if="word.startsWith('{')">
              <component v-if="getMessageIcon(word).component" :is="getMessageIcon(word).component" :class="getMessageIcon(word).class" />&nbsp;
            </template>
            <span v-else-if="word">{{ word }} </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type Component } from 'vue'
import { useLogStore } from '@/stores/useLogStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import helpers from '@/common/helpers'
import { leaderTileTypes, tileTypes } from '@/common/constants'
import BiSuitDiamondFill from '~icons/bi/suit-diamond-fill'
import BiStarFill from '~icons/bi/star-fill'
import BiSuitHeartFill from '~icons/bi/suit-heart-fill'
import BiEggFill from '~icons/bi/egg-fill'
import BiCircleFill from '~icons/bi/circle-fill'
import BiSquareFill from '~icons/bi/square-fill'
import BiTriangleFill from '~icons/bi/triangle-fill'
import BiOctagonFill from '~icons/bi/octagon-fill'

// Get stores
const logStore = useLogStore()
const settingsStore = useSettingsStore()

// Computed properties from stores
const messages = computed(() => logStore.messages)
const showLogTimestamps = computed(() => settingsStore.showLogTimestamps)

// Methods
function getTimestamp(message: any): string {
  return message.timestamp.toLocaleString('en-US')
}

function getLeaderIcon(message: any): Component | null {
  const iconMap: Record<number, Component> = {
    1: BiSuitDiamondFill,
    2: BiStarFill,
    3: BiSuitHeartFill,
    4: BiEggFill,
  }
  return iconMap[message.playerId] || null
}

function getMessageIcon(word: string): { component: Component | null; class: string } {
  word = word.replace(/\r?\n|\r/g, '')
  const wordParts = word.substring(1, word.length - 1).split('|')

  let iconComponent: Component | null = null
  let cssClass = ''

  const playerIconMap: Record<number, Component> = {
    1: BiSuitDiamondFill,
    2: BiStarFill,
    3: BiSuitHeartFill,
    4: BiEggFill,
  }

  const tileIconMap: Record<number, Component> = {
    [tileTypes.temple]: BiCircleFill,
    [tileTypes.market]: BiSquareFill,
    [tileTypes.settlement]: BiTriangleFill,
    [tileTypes.farm]: BiOctagonFill,
  }

  if (wordParts[0] === 'treasure') {
    iconComponent = BiCircleFill // treasure is represented by circle
    cssClass = 'treasure'
  } else {
    const playerId = parseInt(wordParts[0], 10)
    iconComponent = playerIconMap[playerId] || null
  }

  if (wordParts.length === 2) {
    const tileType = parseInt(wordParts[1], 10)
    const isLeader = leaderTileTypes.includes(tileType)
    if (!isLeader) {
      iconComponent = tileIconMap[tileType] || iconComponent
    }
    cssClass = helpers.getTileNameByType(tileType)
  }

  return { component: iconComponent, class: cssClass }
}

function getClass(message: any): string {
  return helpers.getMessageNameByType(message.messageType)
}
</script>

<style lang="scss" scoped>
@use '@/scss/variables.scss' as vars;

.scroll {
  overflow: auto;
  max-height: 200px;
}

.log {
  font-size: 0.8em;
  color: black;

  &.system {
    color: gray;
  }
}

.temple,
.priest {
  color: vars.$color-temple;
}

.market,
.trader {
  color: vars.$color-market;
}

.settlement,
.king {
  color: vars.$color-settlement;
}

.farm,
.farmer {
  color: vars.$color-farm;
}

.treasure {
  color: vars.$color-treasure;
}
</style>

