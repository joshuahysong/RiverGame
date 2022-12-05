<template>
    <div class="map-square"
        :class="getMapSquareClass()"
        @click="doMapSquareClick">
        <civilization-tile v-if="hasTile" class="tile" :tile="tile" />
        <div v-if="showCoordinates" class="coordinates small" :class="{'text-white': hasTile}">{{coordinates}}</div>
    </div>
</template>

<script>
import CivilizationTile from './CivilizationTile.vue'

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
            var row = Math.floor(this.index / 16) + 10
            return `${row.toString(36).toUpperCase()}-${(this.index % 16 + 1)}`;
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
            this.$store.commit('board/addTile', { tile: 2, index: this.index })
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
    .tile {
        height: 90%;
        width: 90%;
        position: absolute;
        display: block;
    }
    .temple {
        background: darkred
    }
    .market {
        background: green;
    }
    .settlement {
        background: black;
    }
    .farm {
        background: dodgerblue;
    }
    .catastrophe {
        background: Yellow;
    }
    
    .treasure {
        height: 25px;
        width: 25px;
        background-color: #bbb;
        border-radius: 50%;
        display: inline-block;
    }
</style>