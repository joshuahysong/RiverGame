<template>
    <div class="card">
        <div class="card-body p-2">
            <div class="row no-gutters">
                <div class="col d-flex h-100">
                    <div class="mx-auto my-auto align-items-center"
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
            </div>
            <div class="row no-gutters"
                :style="rowStyle">
                <div class="col d-flex h-100">
                    <div class="mx-auto my-auto align-items-center"
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
        rowStyle() {
            return `height: ${(this.size === 'lg' ? 60 : 30)}px`
        },
        gridStyle() {
            let gridSize = this.size === 'lg' ? 40 : 20
            return `display: grid;
                grid-template-columns: repeat(6, ${gridSize}px);
                grid-template-rows: repeat(1, ${gridSize}px);
                grid-gap: ${gridSize / 4}px;`
        },
        catastropheTileType(){
            return tileTypes.catastrophe
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
        }
    }
}
</script>