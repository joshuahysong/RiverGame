<template>
    <div class="card">
        <div class="card-header bg-transparent border-0 py-2"><strong>Hand</strong></div>
        <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
            <div v-if="visiblePlayerId !== player.id" class="row no-gutters">
                <div class="col">
                    <div class="row no-gutters justify-content-center align-items-center">
                        <div class="col-auto col-xl-12">
                            <b-icon :icon="leaderIcon" class="mr-2" />{{ player.name  }}'s Turn
                        </div>
                        <div v-if="player.isHuman" class="col-auto col-xl-12 pl-2 pl-xl-0">
                            <b-button
                                variant="success"
                                size="sm"
                                @click="setPlayerVisible"
                                class="mt-0 mt-xl-2">
                                Continue
                            </b-button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="row no-gutters">
                <div class="col-auto col-xl-12 align-self-center justify-content-center">
                    <div class="row no-gutters">
                        <div class="col-auto col-xl-12 text-right text-xl-center">
                            <leader-tile
                                v-for="(tileType, index) in leaderTileTypes.slice(0, 2)"
                                :key="index"
                                :size="size"
                                :tile-type="tileType"
                                :player="player"
                                :class="(index !== 3 ? 'mr-1 mr-md-2' : '')"
                                :selected="isSelectedTile(index, tileType)"
                                :highlight="isHighlightedLeader(tileType)"
                                :disabled="isDisabled(tileType)"
                                @click.native="selectTile(index, tileType)"
                                :show-pointer="!isInConflict"
                                show-empty />
                        </div>
                        <div class="col-auto col-xl-12 text-left text-xl-center">
                            <leader-tile
                                v-for="(tileType, index) in leaderTileTypes.slice(2, 4)"
                                :key="index"
                                :size="size"
                                :tile-type="tileType"
                                :player="player"
                                :class="(index !== 3 ? 'mr-1 mr-md-2' : '')"
                                :selected="isSelectedTile(index + 2, tileType)"
                                :highlight="isHighlightedLeader(tileType)"
                                :disabled="isDisabled(tileType)"
                                @click.native="selectTile(index + 2, tileType)"
                                :show-pointer="!isInConflict"
                                show-empty />
                        </div>
                    </div>
                </div>
                <div class="col col-xl-12 align-self-center justify-content-center pt-xl-4">
                    <div class="row no-gutters">
                        <div class="col col-xl-12 text-right text-xl-center">
                            <civilization-tile
                                v-for="(tileType, index) in playerTiles1"
                                :key="index"
                                :size="size"
                                :tile-type="tileType"
                                :selected="isSelectedTile(index, tileType)"
                                :disabled="isDisabled(tileType)"
                                @click.native="selectTile(index, tileType)"
                                class="d-inline-block mr-2"
                                show-pointer />
                        </div>
                        <div class="col col-xl-12 text-left text-xl-center">
                            <civilization-tile
                                v-for="(tileType, index) in playerTiles2"
                                :key="index"
                                :size="size"
                                :tile-type="tileType"
                                :selected="isSelectedTile(index + 3, tileType)"
                                :disabled="isDisabled(tileType)"
                                @click.native="selectTile(index + 3, tileType)"
                                class="d-inline-block mr-2"
                                show-pointer />
                        </div>
                    </div>
                </div>
                <div class="col-auto col-xl-12 align-self-center justify-content-center pt-xl-4">
                    <civilization-tile
                        v-for="(n, index) in player.catastropheTiles"
                        :key="index"
                        :size="size"
                        :tile-type="tileTypes.catastrophe"
                        :selected="isSelectedTile(index, tileTypes.catastrophe)"
                        :disabled="isDisabled(tileTypes.catastrophe)"
                        @click.native="selectTile(index, tileTypes.catastrophe)"
                        class="d-inline-block mr-2"
                        show-pointer />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CivilizationTile from './CivilizationTile.vue'
import LeaderTile from './LeaderTile.vue'
import { tileTypes, leaderTileTypes, actionTypes, breakpoints } from '../common/constants'
import helpers from '../common/helpers'

export default {
    name: 'PlayerHand',
    components: {
        CivilizationTile,
        LeaderTile
    },
    props: {
        player: Object,
        selectable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            size: 0
        }
    },
    mounted() {
        window.addEventListener("resize", this.onWindowResize);
        this.onWindowResize()
    },
    unmounted() {
        window.removeEventListener("resize", this.onWindowResize);
    },
    computed: {
        ...mapGetters('game', [
            'visiblePlayerId',
            'remainingActions',
            'currentActionType',
            'conflictTileType'
        ]),
        ...mapGetters('board', [
            'tiles',
        ]),
        leaderIcon() {
            return helpers.getPlayerIconNameById(this.player.id)
        },
        tileTypes() {
            return tileTypes
        },
        leaderTileTypes() {
            return leaderTileTypes
        },
        playerTiles1() {
            var max = this.player.hand.length < 3 ? this.player.hand.length : 3
            return this.player.hand.slice(0, max)
        },
        playerTiles2() {
            if (this.player.hand.length < 4) return []
            var max = this.player.hand.length < 6 ? this.player.hand.length : 6
            return this.player.hand.slice(3, max)
        },
        isInConflict() {
            return this.currentActionType === actionTypes.conflictAttack ||
                this.currentActionType === actionTypes.conflictDefend
        }
    },
    methods:{
        setPlayerVisible() {
            this.$store.commit('game/setVisiblePlayerId', this.player.id)
        },
        isSelectedTile(index, tileType) {
            return this.selectable && this.player.selectedTiles.some(x => x.index === index && x.tileType === tileType)
        },
        isHighlightedLeader(tileType) {
            let selectedBoardLeader = this.$store.getters['board/selectedBoardLeader'](this.player.id)
            return this.currentActionType === actionTypes.playTile &&
                selectedBoardLeader &&
                selectedBoardLeader.tileType === tileType
        },
        isDisabled(tileType) {
            return (this.isInConflict && this.conflictTileType !== tileType) ||
                this.remainingActions === 0
        },
        selectTile(index, tileType) {
            if (!this.selectable) return

            let isLeaderTile = leaderTileTypes.includes(tileType)
            let allowTileSelection = false
            if (this.remainingActions > 0 &&
                this.currentActionType === actionTypes.playTile &&
                (!isLeaderTile || (isLeaderTile && this.player.leaders.includes(tileType)))) allowTileSelection = true
            if (this.isInConflict && !isLeaderTile && this.player.hand[index] === this.conflictTileType) allowTileSelection = true
            if (this.currentActionType === actionTypes.swapTiles && !isLeaderTile && tileType !== tileTypes.catastrophe) allowTileSelection = true

            // Selecting a tile in hand
            if (allowTileSelection) {
                if (this.isSelectedTile(index, tileType)) {
                    this.$store.dispatch('players/removeTileSelection', { playerId: this.player.id, index: index, tileType: tileType, isLeaderTile: isLeaderTile })
                } else {
                    if (!this.isInConflict) this.$store.commit('board/resetBoardTileHighlights')
                    this.$store.dispatch('players/addTileSelection', { playerId: this.player.id, index: index, tileType: tileType, isLeaderTile: isLeaderTile })
                }
            // Moving a leader from board to hand
            } else {
                let selectedBoardLeader = this.$store.getters['board/selectedBoardLeader'](this.player.id)
                if (selectedBoardLeader &&
                    selectedBoardLeader.tileType === tileType &&
                    this.currentActionType === actionTypes.playTile
                ) {
                    this.$store.dispatch('game/saveSnapshot')
                    this.$store.commit('players/addLeaderToPlayer', selectedBoardLeader)
                    this.$store.commit('board/removeTile', { index: selectedBoardLeader.index })
                    this.$store.dispatch('board/setRegions')
                    this.$store.commit('board/resetAvailableTileLocations')
                    this.$store.commit('game/actionCompleted')
                    this.$store.commit('log/logActionMessage', {
                        playerId: this.player.id,
                        text: `moved ${helpers.getLogToken(selectedBoardLeader)}
                            from ${helpers.getCoordinatesByIndex(selectedBoardLeader.index)} back to hand`
                    })
                }
            }
        },
        onWindowResize() {
            var windowWidth = window.innerWidth;
            this.size = 40
            if (windowWidth <= breakpoints.medium) this.size = 30
            if (windowWidth <= breakpoints.small) this.size = 20
        }
    }
}
</script>

<style scoped>


@media (min-width: 1200px) {
    .card {
        height: 335px;
    }
}
</style>