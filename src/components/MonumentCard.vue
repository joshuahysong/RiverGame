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
                        :selected="isSelectedMonument(monumentType)"
                        :disabled="!isAvailableMonument(monumentType)"
                        class="d-inline-block mr-2 mb-1"
                        :show-pointer="currentActionType === actionTypes.buildMonument"
                        @click.native="selectMonument(monumentType)" />
                </div>
                <div class="col-6 col-lg-12 text-left text-lg-center">
                    <monument-tile
                        v-for="(monumentType, index) in monumentTypes2"
                        :key="index"
                        :size="40"
                        :monument-type="monumentType"
                        :selected="isSelectedMonument(monumentType)"
                        :disabled="!isAvailableMonument(monumentType)"
                        class="d-inline-block mr-2 mb-1"
                        :show-pointer="currentActionType === actionTypes.buildMonument"
                        @click.native="selectMonument(monumentType)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MonumentTile from './MonumentTile.vue'
import { actionTypes, tileTypes, monumentTypes } from '../common/constants'

export default {
    name: 'MonumentCard',
    components: {
        MonumentTile
    },
    computed: {
        ...mapGetters('game', [
            'currentActionType',
            'remainingMonuments',
            'selectedMonumentType'
        ]),
        ...mapGetters('board', [
            'availableMonumentLocations'
        ]),
        actionTypes() {
            return actionTypes
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
    },
    methods:{
        isSelectedMonument(monumentType) {
            return this.currentActionType === actionTypes.buildMonument && this.selectedMonumentType === monumentType
        },
        isAvailableMonument(monumentType) {
            if (this.currentActionType !== actionTypes.buildMonument) return true
            if (this.availableMonumentLocations && this.availableMonumentLocations.length > 0) {
                if ([monumentTypes.redBlue, monumentTypes.blackRed, monumentTypes.greenRed].some(x => x === monumentType) &&
                    this.availableMonumentLocations.some(x => x.tileType === tileTypes.treasure || x.tileType === tileTypes.temple))
                    return true
                if ([monumentTypes.redBlue, monumentTypes.blueGreen, monumentTypes.blackBlue].some(x => x === monumentType) &&
                    this.availableMonumentLocations.some(x => x.tileType === tileTypes.farm))
                    return true
                if ([monumentTypes.blueGreen, monumentTypes.greenRed, monumentTypes.blackGreen].some(x => x === monumentType) &&
                    this.availableMonumentLocations.some(x => x.tileType === tileTypes.market))
                    return true
                if ([monumentTypes.blackRed, monumentTypes.blackGreen, monumentTypes.blackBlue].some(x => x === monumentType) &&
                    this.availableMonumentLocations.some(x => x.tileType === tileTypes.settlement))
                    return true
            }
            return false
        },
        selectMonument(monumentType) {
            if (this.currentActionType === actionTypes.buildMonument &&
                this.isAvailableMonument(monumentType)) {
                this.$store.commit('game/setSelectedMonumentType', { monumentType: monumentType })
                if (this.availableMonumentLocations.length === 1) {
                    this.$store.dispatch('board/buildMonument', {
                        index: this.availableMonumentLocations[0].index,
                        monumentType: monumentType
                    })
                }
            }
        }
    }
}
</script>