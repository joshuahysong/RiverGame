<template>
    <div class="card">
        <div class="card-header bg-transparent border-0 py-2"><strong>Hand</strong></div>
        <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
            <div class="row no-gutters">
                <div class="col-auto col-xl-12 align-self-center justify-content-center">
                    <div class="row no-gutters">
                        <div class="col-auto col-xl-12 text-right text-xl-center">
                            <leader-tile
                                v-for="(tileType, index) in playerLeaders1"
                                :key="index"
                                :size="size"
                                :tile-type="tileType"
                                :player="player"
                                :class="(index !== 3 ? 'mr-1 mr-md-2' : '')"
                                :selected="isSelectedTile(index, tileType)"
                                @click.native="selectTile(index, tileType)" />
                        </div>
                        <div class="col-auto col-xl-12 text-left text-xl-center">
                            <leader-tile
                                v-for="(tileType, index) in playerLeaders2"
                                :key="index"
                                :size="size"
                                :tile-type="tileType"
                                :player="player"
                                :class="(index !== 3 ? 'mr-1 mr-md-2' : '')"
                                :selected="isSelectedTile(index + 2, tileType)"
                                @click.native="selectTile(index + 2, tileType)" />
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
                                @click.native="selectTile(index, tileType)"
                                class="d-inline-block mr-2" />
                        </div>
                        <div class="col col-xl-12 text-left text-xl-center">
                            <civilization-tile
                                v-for="(tileType, index) in playerTiles2"
                                :key="index"
                                :size="size"
                                :tile-type="tileType"
                                :selected="isSelectedTile(index + 3, tileType)"
                                @click.native="selectTile(index + 3, tileType)"
                                class="d-inline-block mr-2" />
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
                        @click.native="selectTile(index, tileTypes.catastrophe)"
                        class="d-inline-block mr-2" />
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
        ...mapGetters('game', {
            remainingActions: 'remainingActions',
            currentActionType: 'currentActionType'
        }),
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
        playerLeaders1() {
            var max = this.player.leaders.length < 2 ? this.player.leaders.length : 2
            return this.player.leaders.slice(0, max)
        },
        playerLeaders2() {
            if (this.player.leaders.length < 3) return []
            var max = this.player.leaders.length < 4 ? this.player.leaders.length : 4
            return this.player.leaders.slice(2, max)
        }
    },
    methods:{
        isSelectedTile(index, tileType) {
            return this.selectable && this.player.selectedTiles.some(x => x.index === index && x.tileType === tileType)
        },
        selectTile(index, tileType) {
            let isLeaderTile = leaderTileTypes.includes(tileType)
            let isRevolt = this.currentActionType === actionTypes.revoltAttack  || this.currentActionType === actionTypes.revoltDefend
            if (this.selectable &&
                ((this.remainingActions > 0 && this.currentActionType === actionTypes.playTile) ||
                isRevolt && this.player.hand[index] === tileTypes.temple)) {
                if (this.isSelectedTile(index, tileType)) {
                    this.$store.dispatch('players/removeTileSelection', { playerId: this.player.id, index: index, tileType: tileType, isLeaderTile: isLeaderTile })
                } else {
                    this.$store.dispatch('players/addTileSelection', { playerId: this.player.id, index: index, tileType: tileType, isLeaderTile: isLeaderTile })
                }
            }
        },
        getTreasureCount(tileType) {
            const scoreEntries = Object.entries(this.player.score)
            const lowestScore = Math.min(...scoreEntries.map(x => x[1]))
            const lowestScoreFirstIndex = scoreEntries.findIndex(x => x[1] === lowestScore)
            const matchingScoreIndex = scoreEntries.findIndex(x => x[0] === helpers.getTileNameByType(tileType))
            return matchingScoreIndex === lowestScoreFirstIndex ? this.player.score.treasure : 0
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