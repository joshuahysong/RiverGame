<template>
    <player-card :player="player" />
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '../common/helpers'
import PlayerCard from './PlayerCard.vue'

export default {
    name: 'BotCard',
    components: {
        PlayerCard
    },
    props: {
        player: Object
    },
    computed: {
        ...mapGetters('game', [
            'actionPlayerId',
            'currentActionType'
        ]),
        leaderIcon() {
            return helpers.getPlayerIconNameById(this.player.id)
        }
    },
    watch: {
        actionPlayerId(newPlayerId) {
            if (newPlayerId !== this.player.id || this.actionPlayerId !== this.player.id) return

            console.log('My turn!', this.currentActionType, this.player.name)
        }
    }
}
</script>