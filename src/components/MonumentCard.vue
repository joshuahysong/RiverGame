<template>
    <div class="card">
        <div class="card-header bg-transparent border-0 py-2"><strong>Monuments</strong></div>
        <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
            <div class="row no-gutters align-items-center">
                <div class="col-6 col-lg-12 text-right text-lg-center">
                    <monument-tile
                        v-for="monumentType in monumentTypes1"
                        :key="monumentType"
                        :size="size"
                        :monument-type="monumentType"
                        :selected="isSelectedMonument(monumentType)"
                        :disabled="!isAvailableMonument(monumentType)"
                        class="d-inline-block mr-2 mb-1"
                        :show-pointer="isBuildingMonument"
                        @click.native="selectMonument(monumentType)" />
                </div>
                <div class="col-6 col-lg-12 text-left text-lg-center">
                    <monument-tile
                        v-for="monumentType in monumentTypes2"
                        :key="monumentType"
                        :size="size"
                        :monument-type="monumentType"
                        :selected="isSelectedMonument(monumentType)"
                        :disabled="!isAvailableMonument(monumentType)"
                        class="d-inline-block mr-2 mb-1"
                        :show-pointer="isBuildingMonument"
                        @click.native="selectMonument(monumentType)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MonumentTile from './MonumentTile.vue'
import { actionTypes, breakpoints, tileTypes, monumentTypes } from '../common/constants'

export default {
    name: 'MonumentCard',
    components: {
        MonumentTile
    },
    data() {
        return {
            size: 0
        }
    },
    mounted() {
        window.addEventListener("resize", this.onWindowResize);
        this.onWindowResize()
    },
    unmounted() {
        window.removeEventListener("resize", this.onWindowResize);
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
        monumentTypes() {
            return this.remainingMonuments
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
        isBuildingMonument() {
            return this.currentActionType === actionTypes.buildMonument ||
                this.currentActionType === actionTypes.buildMonumentMultiple
        }
    },
    methods:{
        isSelectedMonument(monumentType) {
            return this.isBuildingMonument && this.selectedMonumentType === monumentType
        },
        isAvailableMonument(monumentType) {
            if (!this.isBuildingMonument) return true
            if (this.availableMonumentLocations && this.availableMonumentLocations.length > 0) {
                if (monumentTypes.redMonuments.some(x => x === monumentType) &&
                    this.availableMonumentLocations.some(x => x.tileType === tileTypes.temple))
                    return true
                if (monumentTypes.blueMonuments.some(x => x === monumentType) &&
                    this.availableMonumentLocations.some(x => x.tileType === tileTypes.farm))
                    return true
                if (monumentTypes.greenMonuments.some(x => x === monumentType) &&
                    this.availableMonumentLocations.some(x => x.tileType === tileTypes.market))
                    return true
                if (monumentTypes.blackMonuments.some(x => x === monumentType) &&
                    this.availableMonumentLocations.some(x => x.tileType === tileTypes.settlement))
                    return true
            }
            return false
        },
        selectMonument(monumentType) {
            if (this.isBuildingMonument &&
                this.isAvailableMonument(monumentType)) {
                this.$store.commit('game/setSelectedMonumentType', monumentType)
                if (this.availableMonumentLocations.length === 1) {
                    this.$store.dispatch('board/buildMonument', {
                        index: this.availableMonumentLocations[0].index,
                        monumentType: monumentType
                    })
                } else if (this.availableMonumentLocations.length > 1) {
                    this.availableMonumentLocations.forEach(location => {
                        let tile = this.$store.getters['board/tile'](location.index)
                        this.$store.commit('board/updateTile', { ...tile, isHighlighted: true })
                        this.$store.commit('game/setActionType', actionTypes.buildMonumentMultiple)
                    })
                }
            }
        },
        onWindowResize() {
            var windowWidth = window.innerWidth;
            this.size = 40
            if (windowWidth <= breakpoints.medium) this.size = 35
            if (windowWidth <= breakpoints.small) this.size = 30
        }
    }
}
</script>