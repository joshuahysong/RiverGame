<template>
    <div class="card">
        <div class="card-body p-2">
            <div class="row no-gutters">
                <div class="col d-flex h-100">
                    <div class="my-auto align-items-center"
                        :style="gridStyle">
                        <leader-tile
                        v-for="(tileType, index) in player.leaders"
                            :key="index"
                            :size="iconSize"
                            :tile-type="tileType"
                            :player-id="player.id"
                            :selected="isSelectedTile(index, true)"
                            @click.native="selectLeader(index)" />
                    </div>
                </div>
                <div class="col pl-3 text-left small">
                    <div>
                        <span class="settlement-score">{{player.score.black}}</span>
                        <span class="treasure-score"> +{{ getTreasureCount(tileTypes.settlement) }}</span>
                    </div>
                    <div>
                        <span class="temple-score">{{player.score.red}}</span>
                        <span class="treasure-score"> +{{ getTreasureCount(tileTypes.temple) }}</span>
                    </div>
                </div>
                <div class="col pl-2 text-left small">
                    <div>
                        <span class="farm-score">{{player.score.blue}}</span>
                        <span class="treasure-score"> +{{ getTreasureCount(tileTypes.farm) }}</span>
                    </div>
                    <div>
                        <span class="market-score">{{player.score.green}}</span>
                        <span class="treasure-score"> +{{ getTreasureCount(tileTypes.market) }}</span>
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
                            @click.native="selectHandTile(index)" />
                    </div>
                </div>
                <div class="col pl-3 d-flex">
                    <div class="my-auto small">
                        Actions: {{ remainingActions }}
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
        selectHandTile(index) {
            if (this.selectable && this.remainingActions > 0) {
                this.$store.dispatch('players/addTileSelection', { index: index, isLeaderTile: false })
            }
        },
        selectLeader(index) {
            if (this.selectable && this.remainingActions > 0) {
                this.$store.dispatch('players/addTileSelection', { index: index, isLeaderTile: true })
            }
        },
        getTreasureCount(tileType) {
            // TODO Return count of treasures when passed in tileType has the lowest score
            return tileType
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
</style>