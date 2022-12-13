<template>
    <div class="card">
        <div class="card-body" :class="{'p-1': size === 'sm'}">
            <div class="row align-items-center justify-content-center"
                :style="{ 'height': `${(size === 'lg' ? 80 : 40)}px` }">
                <div v-for="(tile, index) in player.hand"
                    :key="index"
                    class="col-auto"
                    :class="{'p-1': size === 'sm'}">
                    <civilization-tile
                        :size="size === 'lg' ? 60 : 30"
                        :class="{'selected-tile': isSelectedHandTile(index) }"
                        :tile="tile"
                        @click.native="selectHandTile(index)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CivilizationTile from './CivilizationTile.vue'

export default {
    name: 'PlayerHand',  
    components: {
        CivilizationTile
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
        })
    },
    methods:{        
        isSelectedHandTile(index) {
            return this.selectable && this.player.selectedTiles.some(x => x.index === index)
        },
        selectHandTile(index) {
            if (this.selectable && this.remainingActions > 0) {
                this.$store.dispatch('players/addTileSelection', { index: index })
            }
        },
    }
}
</script>

<style scoped>
.selected-tile {
    border: 5px solid black;
    box-sizing: content-box;
}
</style>