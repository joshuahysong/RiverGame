<template>
    <div class="card">
        <div class="card-header bg-transparent border-0 py-2"><strong>Log</strong></div>
        <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
            <div class="scroll border text-left p-2 small">
                <div v-for="(message, index) in messages" :key="index" class="log" :class="getClass(message)">
                    <span v-if="showLogTimestamps">{{ message.timestamp }}: </span><b-icon v-if="message.playerId >= 0" :icon="getLeaderIcon(message)" class="mr-1" />
                    <span v-for="(word, index) in message.text.split(' ')" :key="index">
                        <span v-if="word[0] === '{'"><b-icon v-bind="getMessageIcon(word)" />&nbsp;</span>
                        <span v-else-if="word">{{ word }} </span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLogStore } from '@/stores/useLogStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import helpers from '@/common/helpers'
import { leaderTileTypes } from '@/common/constants'

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

function getLeaderIcon(message: any): string {
  return helpers.getPlayerIconNameById(message.playerId)
}

function getMessageIcon(word: string): { icon: string; class: string } {
  const properties = { icon: '', class: '' }
  word = word.replace(/\r?\n|\r/g, '')
  const wordParts = word.substring(1, word.length - 1).split('|')
  
  if (wordParts[0] === 'treasure') {
    properties.icon = 'circle-fill'
    properties.class = 'treasure'
  } else {
    properties.icon = helpers.getPlayerIconNameById(wordParts[0] * 1)
  }
  
  if (wordParts.length === 2) {
    const isLeader = leaderTileTypes.includes(wordParts[1] * 1)
    if (!isLeader) properties.icon = 'square-fill'
    properties.class = helpers.getTileNameByType(wordParts[1] * 1)
  }
  
  return properties
}

function getClass(message: any): string {
  return helpers.getMessageNameByType(message.messageType)
}
</script>

<style lang="scss" scoped>
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

    .temple, .priest {
        color: $color-temple;
    }

    .market, .trader {
        color: $color-market;
    }

    .settlement, .king {
        color: $color-settlement;
    }

    .farm, .farmer {
        color: $color-farm;
    }

    .treasure {
        color: $color-treasure
    }
</style>