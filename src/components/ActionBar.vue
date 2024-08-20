<template>
    <div class="row no-gutters justify-content-center align-items-center bg-light w-100 py-2 border-bottom action-bar">
        <div class="col-12 col-sm-auto m-0 mr-sm-2">
            <b-icon :icon="leaderIcon" class="mr-2" />
            <div v-if="showCurrentPlayerMessage" class="d-inline-block">
                {{playerName}}'s Turn: {{ remainingActionsMessage }}
            </div>
            <div v-if="showTakeTreasureMessage" class="d-inline-block">
                {{playerName}} must select a Treasure to take.
            </div>
        </div>
        <div v-if="showCurrentPlayerMessage" class="col-12 col-sm-auto pt-1 pt-sm-0">
            <b-button v-if="showCurrentPlayerMessage"
                variant="primary"
                size="sm"
                :disabled="isEndTurnDisabled"
                @click="doEndTurn">
                End Turn
            </b-button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '../common/helpers'
import { actionTypes } from '../common/constants'

export default {
    name: 'ActionBar',
    data() {
        return {
            showCurrentPlayerMessage: true,
            showTakeTreasureMessage: false
        }
    },
    computed: {
        ...mapGetters('game', [
            'remainingActions',
            'currentActionType',
            'currentActionPlayerId'
        ]),
        leaderIcon() {
            return helpers.getPlayerIconNameById(this.currentActionPlayerId)
        },
        player() {
            return this.$store.getters['players/getPlayer'](this.currentActionPlayerId)
        },
        playerName() {
            return this.player?.name
        },
        remainingActionsMessage() {
            return `${this.remainingActions} Action${(this.remainingActions == 1 ? '' : 's')} Remaining. `
        },
        isEndTurnDisabled() {
            return this.remainingActions != 0
        },
    },
    watch: {
        currentActionType(newActionType) {
            this.showCurrentPlayerMessage = false
            this.showTakeTreasureMessage = false
            if (newActionType == actionTypes.playTile) this.showCurrentPlayerMessage = true
            if (newActionType == actionTypes.takeTreasure) this.showTakeTreasureMessage = true
            if (newActionType == actionTypes.revoltAttack ||
                newActionType == actionTypes.revoltDefend) {
                // this.showPlayerMessage = true
                // this.playerMessage = 'Select supporting temples to add'
                // this.messagePlayerId = this.currentActionPlayerId
                // this.showPlayerActionButton = true
                //this.$bvModal.show('bv-modal-example')
            }
        }
    },
    methods: {
        async doEndTurn() {
            await this.$store.dispatch('players/refillPlayerHands')
            this.$store.commit('game/nextActivePlayer')
            this.$store.dispatch('game/save')
        },
    }
}
</script>

<style scoped>
    .action-bar {
        min-height: 40px;
    }
</style>