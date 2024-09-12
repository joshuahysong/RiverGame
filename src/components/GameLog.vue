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

<script>
import { mapGetters } from 'vuex'
import helpers from '../common/helpers'
import { leaderTileTypes } from '@/common/constants';

export default {
    name: 'GameLog',
    computed: {
        ...mapGetters('log', [
            'messages'
        ]),
        ...mapGetters('settings', [
            'showLogTimestamps'
        ]),
    },
    methods: {
        getTimestamp(message) {
            return message.timestamp.toLocaleString("en-US")
        },
        getLeaderIcon(message) {
            return helpers.getPlayerIconNameById(message.playerId)
        },
        getMessageIcon(word) {
            word = word.replace(/\r?\n|\r/g, '')
            const wordParts = word.substring(1, word.length - 1).split('|')
            const properties = {
                icon: helpers.getPlayerIconNameById(wordParts[0] * 1),
                class: ''
            };
            if (wordParts.length === 2) {
                const isLeader = leaderTileTypes.includes(wordParts[1] * 1)
                if (!isLeader) properties.icon = 'square-fill'
                properties.class = helpers.getTileNameByType(wordParts[1] * 1)
            }
            return properties
        },
        getClass(message) {
            return helpers.getMessageNameByType(message.messageType)
        }
    }
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
</style>