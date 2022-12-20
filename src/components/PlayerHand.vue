<template>
    <div class="card">
        <div class="card-body p-1">
            <div class="row align-items-center justify-content-center"
                :style="rowStyle">
                <div v-for="(tileType, index) in player.leaders"
                    :key="index"
                    class="col-auto"
                    :class="{'p-1': size === 'sm'}">
                    <leader-tile
                        :size="iconSize"
                        :tile-type="tileType"
                        :player-id="player.id"
                        :selected="isSelectedTile(index, true)"
                        @click.native="selectLeader(index)" />
                </div>
            </div>
            <div class="row align-items-center justify-content-center"
                :style="rowStyle">
                <div v-for="(tileType, index) in player.hand"
                    :key="index"
                    class="col-auto"
                    :class="{'p-1': size === 'sm'}">
                    <civilization-tile
                        :size="iconSize"
                        :tile-type="tileType"
                        :selected="isSelectedTile(index, false)"
                        @click.native="selectHandTile(index)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CivilizationTile from './CivilizationTile.vue'
import LeaderTile from './LeaderTile.vue'

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
            return this.size === 'lg' ? 50 : 25
        },
        rowStyle() {
            return `height: ${(this.size === 'lg' ? 70 : 35)}px`
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

<style scoped>
.selected-tile {
    border: 5px solid black;
    box-sizing: content-box;
}
</style>