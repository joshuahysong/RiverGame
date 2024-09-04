<template>
    <div class="card">
        <div class="card-header bg-transparent border-0 py-2"><strong>Log</strong></div>
        <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
            <div class="scroll border text-left p-2 small">
                <div v-for="(message, index) in messages" :key="index" class="log" :class="getClass(message)">
                    {{ message.timestamp }}: <b-icon v-if="message.playerId >= 0" :icon="getLeaderIcon(message)" class="mr-1" />{{ message.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '../common/helpers'

export default {
    name: 'GameLog',
    computed: {
        ...mapGetters('log', [
            'messages'
        ])
    },
    methods: {
        getTimestamp(message) {
            return message.timestamp.toLocaleString("en-US")
        },
        getLeaderIcon(message) {
            if (message && message.playerId >= 0)
                return helpers.getPlayerIconNameById(message.playerId)
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
</style>