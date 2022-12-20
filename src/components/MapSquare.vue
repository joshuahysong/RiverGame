<template>
    <div class="map-square"
        :class="getMapSquareClass()"
        @click="doMapSquareClick">
        <civilization-tile v-if="hasTile" :tile="tile" />
        <div v-if="showCoordinates" class="coordinates small" :class="{'text-white': hasTile}">{{coordinates}}</div>
    </div>
</template>

<script>
import CivilizationTile from './CivilizationTile.vue'
import helpers from '../common/helpers'

export default {
    name: 'MapSquare',
    components: {
        CivilizationTile
    },
    props: {
        mapSquareType: Number,
        index: Number,
        showCoordinates: Boolean,
        tile: Number
    },
    computed: {
        coordinates() {
            return helpers.getCoordinatesByIndex(this.index)
        },
        hasTile() {
            return this.tile > 0
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
        height: 90%;
        width: 100%;
        position: absolute;
        display: block;
    }
</style>