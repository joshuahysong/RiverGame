<template>
    <div class="card">
        <div class="card-body p-2">
            <div class="row">
                <div class="col-12 col-sm">
                    <div class="row no-gutters">
                        <div class="col-12 col-sm d-flex h-100">
                            <div class="my-auto align-items-center"
                                :style="gridStyle">
                                <leader-tile
                                v-for="(tileType, index) in player.leaders"
                                    :key="index"
                                    :size="iconSize"
                                    :tile-type="tileType"
                                    :player-id="player.id"
                                    :selected="isSelectedTile(index, true)"
                                    @click.native="selectTile(index, true)" />
                            </div>
                        </div>
                    </div>
                    <div class="row no-gutters mt-2">
                        <div class="col d-flex h-100">
                            <div class="my-auto align-items-center"
                                :style="gridStyle">
                                <civilization-tile
                                    v-for="(tileType, index) in player.hand"
                                    :key="index"
                                    :size="iconSize"
                                    :tile-type="tileType"
                                    :selected="isSelectedTile(index, false)"
                                    @click.native="selectTile(index, false)" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm mt-2 mt-sm-0">
                    <div class="row">
                        <div class="col-auto col-sm pl-3 text-left small">
                            <div class="d-inline d-sm-block pr-3 pr-sm-0">
                                <span class="settlement-score">{{player.score.settlement}}</span>
                                <span class="treasure-score"> +{{getTreasureCount(tileTypes.settlement)}}</span>
                            </div>
                            <div class="d-inline d-sm-block">
                                <span class="temple-score">{{player.score.temple}}</span>
                                <span class="treasure-score"> +{{getTreasureCount(tileTypes.temple)}}</span>
                            </div>
                        </div>
                        <div class="col-6 col-sm pl-2 text-left small">
                            <div class="d-inline d-sm-block pr-3 pr-sm-0">
                                <span class="farm-score">{{player.score.farm}}</span>
                                <span class="treasure-score"> +{{getTreasureCount(tileTypes.farm)}}</span>
                            </div>
                            <div class="d-inline d-sm-block">
                                <span class="market-score">{{player.score.market}}</span>
                                <span class="treasure-score"> +{{getTreasureCount(tileTypes.market)}}</span>
                            </div>
                        </div>
                    </div>
                    <div v-if="size === 'lg'" class="row h-50">
                        <div class="col pl-3 d-flex">
                            <div class="my-auto small">
                                Actions: {{ remainingActions }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CivilizationTile from './CivilizationTile.vue'
import LeaderTile from './LeaderTile.vue'
import { tileTypes } from '../common/constants'
import helpers from '../common/helpers'

export default {
    name: 'PlayerHand',  
    components: {
        CivilizationTile,
        LeaderTile
    },
    props: {
        player: Object,
        size: String,
        selectable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters('game', {
            remainingActions: 'remainingActions'
        }),
        iconSize() {
            return this.size === 'lg' ? 40 : 20
        },
        gridStyle() {
            let gridSize = this.size === 'lg' ? 40 : 20
            return `display: grid;
                grid-template-columns: repeat(6, ${gridSize}px);
                grid-template-rows: repeat(1, ${gridSize}px);
                grid-gap: ${gridSize / 4}px;`
        },
        tileTypes() {
            return tileTypes
        }
    },
    methods:{        
        isSelectedTile(index, isLeaderTile) {
            return this.selectable && this.player.selectedTiles.some(x => x.index === index && x.isLeaderTile === isLeaderTile)
        },
        selectTile(index, isLeaderTile) {
            if (this.selectable && this.remainingActions > 0) {
                if (this.isSelectedTile(index, isLeaderTile)) {
                    this.$store.dispatch('players/removeTileSelection', { index: index, isLeaderTile: isLeaderTile })
                } else {
                    this.$store.dispatch('players/addTileSelection', { index: index, isLeaderTile: isLeaderTile })
                }
            }
        },
        getTreasureCount(tileType) {
            let score = this.player.score[helpers.getTileNameByType(tileType)]
            let values = Object.values(this.player.score)
            let lowestScore = Math.min(...values)
            return score === lowestScore ? this.player.score.treasure : 0
        }
    }
}
</script>

<style scoped>
    .card {
        max-width: 450px;
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