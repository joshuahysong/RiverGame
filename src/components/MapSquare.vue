<template>
    <div class="map-square"
        :class="getMapSquareClass()"
        @click="doMapSquareClick">
        <civilization-tile v-if="hasTile && !tile.isLeaderTile" :tile-type="tile.tileType" :highlight="tile.isHighlighted" />
        <leader-tile v-if="hasTile && tile.isLeaderTile" :tile-type="tile.tileType" :player-id="tile.playerId" :size="40" />
        <div v-if="showKingdoms" class="kingdom" :style="kingdomStyle"></div>
        <div v-if="showCoordinates" class="coordinates" :class="{'text-white': hasTile}">{{coordinates}}</div>
        <div v-if="showIndexes" class="coordinates d-flex justify-content-center" :class="{'text-white': hasTile}"><span class="align-self-end">{{index}}</span></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
        tile: Object
    },
    computed: {
        ...mapGetters('settings', [
            'showKingdoms',
            'showCoordinates',
            'showIndexes'
        ]),
        coordinates() {
            return helpers.getCoordinatesByIndex(this.index)
        },
        hasTile() {
            return this.tile && this.tile.tileType > 0
        },
        kingdomStyle() {
            const kingdom = this.$store.getters['board/getKingdom'](this.index)
            const colors = [
                'FF0000',
                'FFFF00',
                '00EAFF',
                'AA00FF',
                'FF7F00',
                'BFFF00',
                '0095FF',
                'FF00AA',
                'FFD400',
                '6AFF00',
                '0040FF',
                'EDB9B9',
                'B9D7ED',
                'E7E9B9',
                'DCB9ED',
                'B9EDE0',
                '8F2323',
                '23628F',
                '8F6A23',
                '6B238F',
                '4F8F23',
                '000000',
                '737373',
                'CCCCCC'
            ]
            return 'background-color: ' +
                (kingdom && kingdom.tileIndexes.length > 1 ? `#${colors[kingdom.kingdomIndex]};` : 'transparent;')
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
        height: 95%;
        width: 100%;
        position: absolute;
        z-index: 3;
    }
    .kingdom {
        height: 100%;
        width: 100%;
        position: absolute;
        opacity: 30%;
        z-index: 1;
    }
</style>