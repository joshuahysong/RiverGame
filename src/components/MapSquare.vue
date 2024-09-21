<template>
    <div class="map-square ground"
        :class="getMapSquareClass()"
        @click="doMapSquareClick">
        <civilization-tile v-if="hasTile && !tile.isLeaderTile"
            :tile-type="tile.tileType"
            :highlight="tile.isHighlighted"
            :has-treasure="tile.hasTreasure"
            :is-conflict-tile="isConflictTile" />
        <leader-tile v-if="hasTile && tile.isLeaderTile"
            :tile-type="tile.tileType"
            :map-index="index"
            :highlight="tile.isHighlighted"
            :player="getPlayer()"
            :show-pointer="showLeaderPointer"
            :show-strength="showLeaderStrength" />
        <monument-tile v-if="showMonument" :monumentType="tile.monumentType" class="monument"/>
        <div v-if="isRiverTile && riverPath === '='" class="river river-horizontal"></div>
        <div v-if="isRiverTile && riverPath === '║'" class="river river-vertical"></div>
        <div v-if="isRiverTile && showRiverHorizontalLeft" class="river river-horizontal-left"></div>
        <div v-if="isRiverTile && showRiverHorizontalRight" class="river river-horizontal-right"></div>
        <div v-if="isRiverTile && showRiverVerticalBottom" class="river river-vertical-bottom"></div>
        <div v-if="isRiverTile && showRiverVerticalTop" class="river river-vertical-top"></div>
        <div v-if="showKingdoms" class="kingdom" :style="kingdomStyle"></div>
        <div v-if="showCoordinates"
            class="coordinates coordinates-text-size"
            :class="{'text-white': hasTile, 'pointer': ((tile && tile.isHighlighted || showLeaderPointer))}" >
            {{coordinates}}
        </div>
        <div v-if="showIndexes && debug"
            class="coordinates coordinates-text-size d-flex justify-content-center"
            :class="{'text-white': hasTile, 'pointer': ((tile && tile.isHighlighted || showLeaderPointer))}">
            <span class="align-self-end">{{index}}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CivilizationTile from './CivilizationTile.vue'
import LeaderTile from './LeaderTile.vue'
import MonumentTile from './MonumentTile.vue'
import helpers from '../common/helpers'
import { mapTypes, tileTypes, actionTypes } from '../common/constants'

export default {
    name: 'MapSquare',
    components: {
        CivilizationTile,
        LeaderTile,
        MonumentTile
    },
    props: {
        mapSquareType: Number,
        index: Number,
        tile: Object
    },
    data() {
        return {
            isPriorityTreasureSquare: false,
            isRiverTile: false,
            riverPath: null
        }
    },
    mounted() {
        this.isRiverTile = this.mapSquareType === mapTypes.river
        this.isPriorityTreasureSquare = this.mapSquareType === mapTypes.priorityTreasure
        if (this.isRiverTile) {
            this.riverPath = this.$store.getters['board/getRiverPath'](this.index)
        }
    },
    computed: {
        ...mapGetters('settings', [
            'showKingdoms',
            'showCoordinates',
            'showIndexes',
            'showLeaderStrength'
        ]),
        ...mapGetters('players', [
            'currentPlayer'
        ]),
        ...mapGetters('game', [
            'debug',
            'currentActionType'
        ]),
        ...mapGetters('board', [
            'conflictTile'
        ]),
        coordinates() {
            return helpers.getCoordinatesByIndex(this.index)
        },
        hasTile() {
            return this.tile && this.tile.tileType !== tileTypes.empty
        },
        showRiverHorizontalLeft() {
            return this.riverPath === '╗' || this.riverPath  === '╝'
        },
        showRiverHorizontalRight() {
            return this.riverPath === '╔' || this.riverPath  === '╚'
        },
        showRiverVerticalBottom() {
            return this.riverPath === '╔' || this.riverPath  === '╗'
        },
        showRiverVerticalTop() {
            return this.riverPath === '╚' || this.riverPath  === '╝'
        },
        kingdomStyle() {
            var blankCss = 'background-color: transparent;'
            if (!this.hasTile) return blankCss
            const kingdomIndex = this.$store.getters['board/getKingdomIndex'](this.index)
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
            return kingdomIndex >= 0 ? `background-color: #${colors[kingdomIndex]};` : blankCss
        },
        showMonument() {
            return this.tile &&
                this.tile.monumentType &&
                this.tile.tileType === tileTypes.monumentBottomRight
        },
        tileTypes() {
            return tileTypes
        },
        showLeaderPointer() {
            return this.currentPlayer && this.tile &&
                this.currentPlayer.id === this.tile.playerId &&
                this.currentActionType === actionTypes.playTile
        },
        isConflictTile() {
            return this.conflictTile && this.conflictTile.index === this.index
        }
    }, 
    methods: {
        getMapSquareClass() {
            var mapClass = ''
            let availableTileLocations = this.$store.getters['board/getAvailableTileLocations']
            if (availableTileLocations && availableTileLocations.includes(this.index))
                mapClass += ' valid-location'
            if (this.isPriorityTreasureSquare && this.tile && this.tile.hasTreasure)
                mapClass += ' priority-treasure'
            return mapClass;
        },
        doMapSquareClick() {
            this.$store.dispatch('board/handleBoardClick', this.tile)
        },
        getPlayer() {
            return this.$store.getters['players/getPlayer'](this.tile.playerId)
        },
    }
}
</script>

<style scoped>
    .ground {
        background: BurlyWood;
    }

    .water {
        background: PaleTurquoise;
    }

    .valid-location {
        box-shadow: inset -1px -1px 100px 100px rgb(0 255 255 / 35%);
    }

    .priority-treasure {
        box-shadow: inset 0px 0px 0px 10px white
    }

    .map-square {
        position: relative;
    }

    .coordinates {
        cursor: default;
        height: 95%;
        width: 100%;
        position: absolute;
        z-index: 5;
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
    }

    .coordinates-text-size {
        font-size: 0.65em;
    }

    @media (max-width: 577px) {
        .coordinates-text-size {
            font-size: 0.45em;
        }
    }

    .river {
        background: PaleTurquoise;
        position: absolute;
        z-index: 2;
    }

    .river-horizontal {
        top: 25%;
        height: 50%;
        width: 100%;
    }

    .river-vertical {
        left: 25%;
        height: 100%;
        width: 50%;
    }

    .river-horizontal-right {
        height: 50%;
        width: 75%;
        right: 0;
    }

    .river-horizontal-left {
        height: 50%;
        width: 75%;
        left: 0;
    }

    .river-vertical-top {
        height: 75%;
        width: 50%;
        top: 0;
    }

    .river-vertical-bottom {
        height: 75%;
        width: 50%;
        bottom: 0;
    }

    .kingdom {
        height: 100%;
        width: 100%;
        position: absolute;
        opacity: 30%;
        z-index: 1;
    }

    .monument {
        height: calc(140% + 2px);
        width: calc(140% + 2px);
        bottom: 30%;
        right: 30%;
        position: absolute;
        padding: 2px;
        z-index: 4;
    }

    @media (max-width: 767.98px) {
        .monument {
            height: calc(140%);
            width: calc(140%);
            bottom: 30%;
            right: 30%;
            position: absolute;
            padding: 2px;
            z-index: 4;
        }
    }
</style>