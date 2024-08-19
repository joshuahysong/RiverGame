<template>
    <div class="card">
        <div class="card-body p-2">
            <div class="row no-gutters">
                <div class="col align-self-center">
                    <leader-tile
                        v-for="(tileType, index) in player.leaders"
                        :key="index"
                        :size="size"
                        :tile-type="tileType"
                        :player-id="player.id"
                        :selected="isSelectedTile(index, true)"
                        @click.native="selectTile(index, true)"
                        class="mr-2" />
                </div>
            </div>
            <div class="row no-gutters mt-2">
                <div class="col align-self-center">
                    <civilization-tile
                        v-for="(tileType, index) in player.hand"
                        :key="index"
                        :size="size"
                        :tile-type="tileType"
                        :selected="isSelectedTile(index, false)"
                        @click.native="selectTile(index, false)"
                        class="mr-2" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CivilizationTile from './CivilizationTile.vue'
import LeaderTile from './LeaderTile.vue'
import { tileTypes, actionTypes } from '../common/constants'
import helpers from '../common/helpers'

export default {
    name: 'PlayerHand',
    components: {
        CivilizationTile,
        LeaderTile
    },
    props: {
        player: Object,
        size: Number,
        selectable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters('game', {
            remainingActions: 'remainingActions',
            currentActionType: 'currentActionType'
        }),
        tileTypes() {
            return tileTypes
        }
    },
    methods:{
        isSelectedTile(index, isLeaderTile) {
            return this.selectable && this.player.selectedTiles.some(x => x.index === index && x.isLeaderTile === isLeaderTile)
        },
        selectTile(index, isLeaderTile) {
            let isRevolt = this.currentActionType === actionTypes.revoltAttack  || this.currentActionType === actionTypes.revoltDefend
            if (this.selectable &&
                ((this.remainingActions > 0 && this.currentActionType === actionTypes.playTile) ||
                isRevolt && this.player.hand[index] === tileTypes.temple)) {
                if (this.isSelectedTile(index, isLeaderTile)) {
                    this.$store.dispatch('players/removeTileSelection', { playerId: this.player.id, index: index, isLeaderTile: isLeaderTile })
                } else {
                    this.$store.dispatch('players/addTileSelection', { playerId: this.player.id, index: index, isLeaderTile: isLeaderTile })
                }
            }
        },
        getTreasureCount(tileType) {
            const scoreEntries = Object.entries(this.player.score)
            const lowestScore = Math.min(...scoreEntries.map(x => x[1]))
            const lowestScoreFirstIndex = scoreEntries.findIndex(x => x[1] === lowestScore)
            const matchingScoreIndex = scoreEntries.findIndex(x => x[0] === helpers.getTileNameByType(tileType))
            return matchingScoreIndex === lowestScoreFirstIndex ? this.player.score.treasure : 0
        }
    }
}
</script>

<style scoped>
    .card {
        min-width: 300px;
    }
    .temple-score {
        color: darkred;
    }
    .market-score  {
        color: green;
    }
    .settlement-score  {
        color: DimGray;
    }
    .farm-score  {
        color: dodgerblue;
    }
    .treasure-score  {
        color: goldenrod;
    }
    .h-50 {
        height: 50% !important;
    }
</style>