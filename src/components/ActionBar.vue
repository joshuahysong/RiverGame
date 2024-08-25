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
            <div v-if="showBuildMonumentMessage" class="d-inline-block">
                {{playerName}}: Select a monument to build.
            </div>
            <div v-if="showBuildMonumentMultipleMessage" class="d-inline-block">
                {{playerName}}: Select the top-left location for the monument.
            </div>
        </div>
        <div v-if="showBuildMonumentMessage || showBuildMonumentMultipleMessage" class="col-12 col-sm-auto pt-1 pt-sm-0">
            <b-button
                variant="warning"
                size="sm"
                @click="passMonumentBuilding">
                Pass
            </b-button>
        </div>
        <div v-if="showCurrentPlayerMessage" class="col-12 col-sm-auto pt-1 pt-sm-0">
            <b-button
                variant="danger"
                size="sm"
                :disabled="isPassTurnDisabled"
                @click="showPassTurnMessageBox"
                class="mr-2">
                Pass
            </b-button>
            <b-button
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
            showTakeTreasureMessage: false,
            showBuildMonumentMessage: false,
            showBuildMonumentMultipleMessage: false
        }
    },
    computed: {
        ...mapGetters('game', [
            'remainingActions',
            'currentActionType',
            'currentActionPlayerId'
        ]),
        ...mapGetters('board', [
            'availableMonumentLocations'
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
        isPassTurnDisabled() {
            return this.remainingActions == 0
        }
    },
    watch: {
        currentActionType(newActionType) {
            this.showCurrentPlayerMessage = false
            this.showTakeTreasureMessage = false
            this.showBuildMonumentMessage = false
            this.showBuildMonumentMultipleMessage = false
            if (newActionType == actionTypes.playTile) this.showCurrentPlayerMessage = true
            if (newActionType == actionTypes.takeTreasure) this.showTakeTreasureMessage = true
            if (newActionType == actionTypes.buildMonument) this.showBuildMonumentMessage = true
            if (newActionType == actionTypes.buildMonumentMultiple) this.showBuildMonumentMultipleMessage = true
        }
    },
    methods: {
        async doEndTurn() {
            this.$store.dispatch('board/checkForMonumentScore')
            await this.$store.dispatch('players/refillPlayerHands')
            this.$store.commit('game/nextActivePlayer')
            this.$store.dispatch('game/save')
        },
        async showPassTurnMessageBox() {
            const h = this.$createElement
            //const message = h('div', { domProps: { innerHTML: `Are you sure?<br/>You have ${this.remainingActionsMessage}` } })
            const message = h('div', { class: ['text-center'] }, [ 'Are you sure?', h('br'), `You have ${this.remainingActionsMessage}` ])
            this.$bvModal.msgBoxConfirm(message, {
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'Pass Turn',
                cancelVariant: 'primary',
                footerClass: 'border-top-0'
            })
            .then(async result => {
                if (result) {
                    await this.doEndTurn()
                }
            })
        },
        passMonumentBuilding() {
            this.showBuildMonumentMessage = false
            this.availableMonumentLocations.forEach(location => {
                let tile = this.$store.getters['board/tile'](location.index)
                this.$store.commit('board/updateTile', { ...tile, isHighlighted: false })
            })
            this.$store.commit('game/setActionType', { actionType: actionTypes.playTile })
            this.$store.commit('game/actionCompleted')
        }
    }
}
</script>

<style scoped>
    .action-bar {
        min-height: 50px;
    }
</style>