<template>
    <div class="map-square"
        :class="getMapSquareClass()"
        @click="doMapSquareClick">
        <civilization-tile v-if="hasTile && !tile.isLeaderTile" :tile-type="tile.tileType" />
        <leader-tile v-if="hasTile && tile.isLeaderTile" :tile-type="tile.tileType" :player-id="tile.playerId" :size="40" />
        <div v-if="showCoordinates" class="coordinates" :class="{'text-white': hasTile}">{{coordinates}}</div>
        <div v-if="showIndexes" class="coordinates" :class="{'text-white': hasTile}">{{index}}</div>
    </div>
</template>

<script>
import CivilizationTile from './CivilizationTile.vue'
import LeaderTile from './LeaderTile.vue'
import helpers from '../common/helpers'

export default {
    name: 'MapSquare',
    components: {
        CivilizationTile,
        LeaderTile
    },
    props: {
        mapSquareType: Number,
        index: Number,
        showCoordinates: Boolean,
        showIndexes: Boolean,
        tile: Object
    },
    computed: {
        coordinates() {
            return helpers.getCoordinatesByIndex(this.index)
        },
        hasTile() {
            return this.tile && this.tile.tileType > 0
        }
    }, 
    methods: {
        getMapSquareClass() {
            if (this.mapSquareType === 1){
                return 'water'
            }
            return 'ground'
        },
        doMapSquareClick() {
            this.$store.dispatch('board/handleBoardClick', { index: this.index })
        }
    }
}
</script>

<style scoped>
    .ground {
        background: BurlyWood;
    }
    .water{
        background: PaleTurquoise;
    }
    .map-square {
        position: relative;
    }
    .coordinates {
        font-size: 0.65em;
        height: 90%;
        width: 100%;
        position: absolute;
        display: block;
    }
</style>