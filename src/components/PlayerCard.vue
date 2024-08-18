<template>
    <div class="card">
        <div class="card-body p-2">
            <div class="row no-gutters">
                <div class="col">
                    <div class="my-auto align-items-center" :style="gridStyle">
                        <leader-tile
                            v-for="(tileType, index) in player.leaders"
                            :key="index"
                            :tile-type="tileType"
                            :player-id="player.id" />
                    </div>
                </div>
                <div class="col-auto">
                    <div class="row no-gutters">
                        <div class="col-auto pr-1"><civilization-tile :tile-type="tileTypes.generic" :size="25" /></div>
                        <div class="col-auto pr-2">x{{player.hand.length}}</div>
                        <div class="col-auto pr-1"><civilization-tile :tile-type="tileTypes.catastrophe" :size="25" /></div>
                        <div class="col-auto">x2</div>
                    </div>
                </div>
            </div>
            <div v-if="showScore" class="row no-gutters mt-3">
                <div class="col-auto align-self-center">
                    <div class="score-icon score-temple d-inline-block mr-1"></div>
                </div>
                <div class="col-auto align-self-center pr-2">
                    <div class="temple-score d-inline-block small">{{player.score.temple}}</div>
                </div>
                <div class="col-auto align-self-center">
                    <div class="score-icon score-market d-inline-block mr-2"></div>
                </div>
                <div class="col-auto align-self-center pr-2">
                    <div class="market-score d-inline-block small">{{player.score.market}}</div>
                </div>
                <div class="col-auto align-self-center">
                    <div class="score-icon score-farm d-inline-block mr-2"></div>
                </div>
                <div class="col-auto align-self-center pr-2">
                    <div class="farm-score d-inline-block small">{{player.score.farm}}</div>
                </div>
                <div class="col-auto align-self-center">
                    <div class="score-icon score-settlement d-inline-block mr-2"></div>
                </div>
                <div class="col-auto align-self-center pr-2">
                    <div class="settlement-score d-inline-block small">{{player.score.settlement}}</div>
                </div>
                <div class="col-auto align-self-center">
                    <div class="score-icon score-treasure d-inline-block mr-2"></div>
                </div>
                <div class="col-auto align-self-center pr-2">
                    <div class="treasure-score d-inline-block small">{{player.score.treasure}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
        showScore: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        gridStyle() {
            let gridSize = 25
            return `display: grid;
                grid-template-columns: repeat(4, ${gridSize}px);
                grid-template-rows: repeat(1, ${gridSize}px);
                grid-gap: ${gridSize / 4}px;`
        },
        tileTypes() {
            return tileTypes
        }
    }
}
</script>

<style scoped>
    .card {
        width: 250px;
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
    .score-icon {
        height: 15px;
        width: 20px;
    }
    .score-temple {
        background-color: firebrick;
        border: 2px solid darkred;
    }
    .score-market {
        background-color: forestgreen;
        border: 2px solid green;
    }
    .score-farm {
        background-color: deepskyblue;
        border: 2px solid dodgerblue;
    }
    .score-settlement {
        background-color: gray;
        border: 2px solid DimGray;
    }
    .score-treasure {
        background-color: gold;
        border: 2px solid goldenrod;
    }
</style>