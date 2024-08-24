<template>
    <div class="card">
        <div class="card-header bg-transparent border-0 py-2"><strong>Monuments</strong></div>
        <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
            <div class="row no-gutters align-items-center">
                <div class="col-6 col-lg-12 text-right text-lg-center">
                    <monument-tile
                        v-for="(monumentType, index) in monumentTypes1"
                        :key="index"
                        :size="40"
                        :monument-type="monumentType"
                        class="d-inline-block mr-2" />
                </div>
                <div class="col-6 col-lg-12 text-left text-lg-center">
                    <monument-tile
                        v-for="(monumentType, index) in monumentTypes2"
                        :key="index"
                        :size="40"
                        :monument-type="monumentType"
                        class="d-inline-block mr-2" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MonumentTile from './MonumentTile.vue'
import { tileTypes } from '../common/constants'

export default {
    name: 'MonumentCard',
    components: {
        MonumentTile
    },
    computed: {
        ...mapGetters('game', [
            'remainingMonuments'
        ]),
        tileTypes() {
            return tileTypes
        },
        monumentTypes1() {
            var max = this.remainingMonuments.length < 3 ? this.remainingMonuments.length : 3
            return this.remainingMonuments.slice(0, max)
        },
        monumentTypes2() {
            if (this.remainingMonuments.length < 4) return []
            var max = this.remainingMonuments.length < 6 ? this.remainingMonuments.length : 6
            return this.remainingMonuments.slice(3, max)
        },
    }
}
</script>