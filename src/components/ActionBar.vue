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
            <div v-if="showWarMessage" class="d-inline-block">
                {{playerName}}: Select<b-icon icon="square-fill" :class="warTileType" class="mx-2" />to commit for support.
            </div>
            <div v-if="showWarChooseLeaderMessage" class="d-inline-block">
                {{playerName}}: Select which leaders must battle first.
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
        <div v-if="showWarMessage" class="col-12 col-sm-auto pt-1 pt-sm-0">
            <b-button
                v-if="showRevoltAttackMessage"
                variant="warning"
                size="sm"
                @click="undoLastAction"
                :disabled="!hasSnapshot"
                class="mr-2">
                Undo
            </b-button>
            <b-button
                variant="success"
                size="sm"
                @click="commitTilesToConflict">
                Commit {{ player.selectedTiles.length}} Tiles
            </b-button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '../common/helpers'
import { actionTypes, conflictTypes } from '../common/constants'

export default {
    name: 'ActionBar',
    computed: {
        ...mapGetters('game', [
            'remainingActions',
            'activeTurnPlayerId',
            'currentActionType',
            'currentActionPlayerId',
            'hasSnapshot',
            'conflictAttackerLeader',
            'conflictDefenderLeader',
            'conflictTileType',
            'conflictType'
        ]),
        ...mapGetters('board', [
            'availableMonumentLocations',
            'treasuresToTake',
            'conflictTile',
            'remainingTreasures'
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
        },
        warTileType() {
            return helpers.getTileNameByType(this.conflictTileType)
        },
        showCurrentPlayerMessage() { return this.currentActionType === actionTypes.playTile },
        showTakeTreasureMessage() { return this.currentActionType === actionTypes.takeTreasure },
        showBuildMonumentMessage() { return this.currentActionType === actionTypes.buildMonument },
        showBuildMonumentMultipleMessage() { return this.currentActionType === actionTypes.buildMonumentMultiple },
        showSwapTilesMessage() { return this.currentActionType === actionTypes.swapTiles },
        showRevoltAttackMessage() { return this.conflictType === conflictTypes.revolt && this.currentActionType === actionTypes.conflictAttack },
        showRevoltDefendMessage() { return this.conflictType === conflictTypes.revolt && this.currentActionType === actionTypes.conflictDefend },
        showWarAttackMessage() { return this.conflictType === conflictTypes.war && this.currentActionType === actionTypes.conflictAttack },
        showWarDefendMessage() { return this.conflictType === conflictTypes.war && this.currentActionType === actionTypes.conflictDefend },
        showWarChooseLeaderMessage() { return this.currentActionType === actionTypes.conflictChooseLeader },
        showWarMessage() {
            return this.showRevoltAttackMessage ||
                this.showRevoltDefendMessage ||
                this.showWarAttackMessage ||
                this.showWarDefendMessage
        }
    },
    methods: {
        async doEndTurn() {
            this.$store.commit('game/clearSnapshot')
            this.$store.commit('board/resetBoardTileHighlights')
            this.$store.commit('board/resetAvailableTileLocations')
            this.$store.dispatch('board/checkForMonumentScore')
            if (this.remainingTreasures <= 2) {
                this.$store.commit('log/logActionMessage', {
                    text: `Game has ended due to ${this.remainingTreasures.remainingTreasures} treasure remaining on the board`
                }, { root: true })
                this.$store.commit('game/setActionType', actionTypes.gameOver)
            }
            await this.$store.dispatch('players/refillPlayerHands')
            this.$store.dispatch('game/save')
            if (this.currentActionType !== actionTypes.gameOver) {
                this.$store.commit('game/nextActivePlayer')
            }
        },
        async showPassTurnMessageBox() {
            this.$store.commit('board/resetAvailableTileLocations')
            this.$store.commit('board/resetBoardTileHighlights')
            const h = this.$createElement
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
            this.$store.commit('game/setActionType', actionTypes.playTile)
            this.$store.commit('game/actionCompleted')
            this.$store.commit('board/checkForTreasureToTake')
        },
        beginSwapTiles(){
            this.$store.commit('board/resetAvailableTileLocations')
            this.$store.commit('board/resetBoardTileHighlights')
            this.$store.commit('players/clearTileSelection', { playerId: this.player.id })
            this.$store.commit('game/setActionType', actionTypes.swapTiles)
        },
        stopSwapTiles() {
            this.$store.commit('players/clearTileSelection', { playerId: this.player.id })
            this.$store.commit('game/clearSnapshot')
            this.$store.commit('game/setActionType', actionTypes.playTile)
        },
        async doSwapTiles() {
            await this.$store.dispatch('players/swapTiles', {...this.player})
            if (this.currentActionType !== actionTypes.gameOver) {
                this.$store.commit('game/setActionType', actionTypes.playTile)
                this.$store.commit('game/actionCompleted')
            } else {
                this.$store.dispatch('game/save')
            }
        },
        undoLastAction() {
            this.$store.dispatch('game/restoreSnapshot')
            this.$store.commit('game/clearSnapshot')
            this.$store.commit('board/resetBoardTileHighlights')
        },
        commitTilesToConflict() {
            if (this.currentActionType === actionTypes.conflictAttack) {
                this.$store.commit('game/clearSnapshot')
                this.$store.commit('game/setConflictAttackerTiles', this.player.selectedTiles)
                this.$store.commit('players/removeTilesFromHand', { playerId: this.player.id, tilesToRemove: [...this.player.selectedTiles] })
                this.$store.commit('players/clearTileSelection', { playerId: this.player.id })
                this.$store.commit('game/setCurrentActionPlayerId', this.conflictDefenderLeader.playerId)
                this.$store.commit('game/setCurrentHandDisplayPlayerId', this.conflictDefenderLeader.playerId)
                this.$store.commit('game/setActionType', actionTypes.conflictDefend)
            } else if (this.currentActionType === actionTypes.conflictDefend) {
                this.$store.commit('game/setConflictDefenderTiles', this.player.selectedTiles)
                this.$store.commit('players/removeTilesFromHand', { playerId: this.player.id, tilesToRemove: [...this.player.selectedTiles] })
                this.$store.commit('players/clearTileSelection', { playerId: this.player.id })
                this.$store.dispatch('game/resolveConflict')
                this.$store.dispatch('board/checkForWar', this.conflictTile)
                if (this.currentActionType !== actionTypes.conflictAttack && this.currentActionType !== actionTypes.conflictChooseLeader) {
                    this.$store.commit('game/setCurrentActionPlayerId', this.activeTurnPlayerId)
                    this.$store.commit('game/setCurrentHandDisplayPlayerId', this.activeTurnPlayerId)
                    this.$store.commit('game/setActionType', actionTypes.playTile)
                    this.$store.commit('game/actionCompleted')
                    this.$store.dispatch('board/checkForTreasureToTake')
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .action-bar {
        min-height: 50px;
    }

    .temple {
        color: $color-temple;
    }

    .market {
        color: $color-market;
    }

    .settlement {
        color: $color-settlement;
    }

    .farm {
        color: $color-farm;
    }
</style>