<template>
    <div class="row no-gutters justify-content-center align-items-center bg-light w-100 py-2 border-bottom action-bar">
        <div class="col-12 col-sm-auto m-0 mr-sm-2">
            <b-icon :icon="leaderIcon" class="mr-2" />
            <div v-if="showCurrentPlayerMessage" class="d-inline-block">
                {{playerName}}'s Turn: {{ remainingActionsMessage }}
            </div>
            <div v-if="showTakeTreasureMessage" class="d-inline-block">
                {{playerName}} {{treasureMessage}}
            </div>
            <div v-if="showBuildMonumentMessage" class="d-inline-block">
                {{playerName}}: Select a monument to build.
            </div>
            <div v-if="showBuildMonumentMultipleMessage" class="d-inline-block">
                {{playerName}}: Select the top-left location for the monument.
            </div>
            <div v-if="showSwapTilesMessage" class="d-inline-block">
                {{playerName}}: Select tiles to discard and redraw.
            </div>
        </div>
        <div v-if="showCurrentPlayerMessage" class="col-12 col-sm-auto pt-1 pt-sm-0">
            <b-button
                variant="primary"
                size="sm"
                @click="beginSwapTiles"
                :disabled="areActionsDepleted"
                class="mr-2">
                Swap Tiles
            </b-button>
            <b-button
                variant="warning"
                size="sm"
                @click="undoLastAction"
                :disabled="!hasSnapshot"
                class="mr-2">
                Undo
            </b-button>
            <b-button
                variant="danger"
                size="sm"
                :hidden="areActionsDepleted"
                @click="showPassTurnMessageBox"
                class="mr-2">
                Pass
            </b-button>
            <b-button
                variant="success"
                size="sm"
                :hidden="!areActionsDepleted"
                @click="doEndTurn">
                End Turn
            </b-button>
        </div>
        <div v-if="showBuildMonumentMessage || showBuildMonumentMultipleMessage" class="col-12 col-sm-auto pt-1 pt-sm-0">
            <b-button
                variant="warning"
                size="sm"
                @click="passMonumentBuilding">
                Pass
            </b-button>
        </div>
        <div v-if="showSwapTilesMessage" class="col-12 col-sm-auto pt-1 pt-sm-0">
            <b-button
                variant="warning"
                size="sm"
                @click="stopSwapTiles"
                class="mr-2">
                Cancel
            </b-button>
            <b-button
                variant="danger"
                size="sm"
                @click="doSwapTiles">
                Discard {{ player.selectedTiles.length }} Tile{{ player.selectedTiles.length === 1 ? '' : 's' }}
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
            showBuildMonumentMultipleMessage: false,
            showSwapTilesMessage: false
        }
    },
    mounted() {
        this.setMessageDisplayToggles(this.currentActionType)
    },
    computed: {
        ...mapGetters('game', [
            'remainingActions',
            'currentActionType',
            'currentActionPlayerId',
            'hasSnapshot'
        ]),
        ...mapGetters('board', [
            'availableMonumentLocations',
            'treasuresToTake'
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
        areActionsDepleted() {
            return this.remainingActions == 0
        },
        treasureMessage() {
            return this.treasuresToTake > 1
                ? `must select 1 of ${this.treasuresToTake} Treasures to acquire.`
                : 'must select a Treasure to acquire.'
        }
    },
    watch: {
        currentActionType(newActionType) {
            this.setMessageDisplayToggles(newActionType)
        }
    },
    methods: {
        setMessageDisplayToggles(newActionType) {
            this.showCurrentPlayerMessage = newActionType == actionTypes.playTile
            this.showTakeTreasureMessage = newActionType == actionTypes.takeTreasure
            this.showBuildMonumentMessage = newActionType == actionTypes.buildMonument
            this.showBuildMonumentMultipleMessage = newActionType == actionTypes.buildMonumentMultiple
            this.showSwapTilesMessage = newActionType == actionTypes.swapTiles
        },
        async doEndTurn() {
            this.$store.commit('game/clearSnapshot')
            this.$store.commit('board/resetBoardTileHighlights')
            this.$store.commit('board/resetAvailableTileLocations')
            this.$store.dispatch('board/checkForMonumentScore')
            await this.$store.dispatch('players/refillPlayerHands')
            this.$store.commit('game/nextActivePlayer')
            this.$store.dispatch('game/save')
        },
        async showPassTurnMessageBox() {
            this.$store.commit('board/resetAvailableTileLocations')
            this.$store.commit('board/resetBoardTileHighlights')
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
                    this.$store.commit('log/logActionMessage', {
                        playerId: this.player.id,
                        text: `passed their turn`
                    })
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
        },
        beginSwapTiles(){
            this.$store.commit('board/resetAvailableTileLocations')
            this.$store.commit('board/resetBoardTileHighlights')
            this.$store.commit('players/clearTileSelection', { playerId: this.player.id })
            this.$store.commit('game/setActionType', { actionType: actionTypes.swapTiles })
        },
        stopSwapTiles() {
            this.$store.commit('players/clearTileSelection', { playerId: this.player.id })
            this.$store.commit('game/clearSnapshot')
            this.$store.commit('game/setActionType', { actionType: actionTypes.playTile })
        },
        async doSwapTiles() {
            let tilesToRemove = [...this.player.selectedTiles]
            this.$store.commit('players/clearTileSelection', { playerId: this.player.id })
            this.$store.commit('players/removeTilesFromHand', { playerId: this.player.id, tilesToRemove: tilesToRemove })
            await this.$store.dispatch('players/refillPlayerHands')
            this.$store.commit('game/setActionType', { actionType: actionTypes.playTile })
            this.$store.commit('game/actionCompleted')
        },
        undoLastAction() {
            this.$store.dispatch('game/restoreSnapshot')
            this.$store.commit('game/clearSnapshot')
            this.$store.commit('board/resetBoardTileHighlights')
        }
    }
}
</script>

<style scoped>
    .action-bar {
        min-height: 50px;
    }
</style>