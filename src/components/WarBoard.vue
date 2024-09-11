<template>
    <div class="card">
        <div class="card-body px-2 py-0">
            <div class="row no-gutters align-items-center">
                <div class="col-12 col-sm-6 text-left border-bottom border-right hide-border py-2">
                    <div class="row no-gutters text-center py-2">
                        <div class="col">
                            <strong>Attacker</strong>
                        </div>
                    </div>
                    <div class="row no-gutters align-items-center pb-2 pr-sm-1">
                        <div class="col-2"></div>
                        <div class="col-5 small">
                            <strong>Board</strong>
                        </div>
                        <div class="col-5 small">
                            <strong>Support</strong>
                        </div>
                    </div>
                    <div class="row no-gutters align-items-center pr-sm-1">
                        <div class="col-2">
                            <div class="row no-gutters align-items-center">
                                <div class="col-auto pr-1">
                                    <leader-tile
                                        :size="size"
                                        :tile-type="conflictAttackerLeader.tileType"
                                        :player="getPlayer(conflictAttackerLeader.playerId)"/>
                                </div>
                                <div class="col-auto text-left pr-1">
                                    {{ getBoardStrength(conflictAttackerLeader).length + conflictAttackerTiles.length }}
                                </div>
                            </div>
                        </div>
                        <div class="col-5">
                            <div class="row no-gutters justify-content-start">
                                <civilization-tile
                                    v-for="(tile, index) in getBoardStrength(conflictAttackerLeader)"
                                    :key="index"
                                    :tile-type="tile.tileType" :size="size"
                                    class="col-auto mr-1 mb-1" />
                            </div>
                        </div>
                        <div class="col-5">
                            <div class="row no-gutters justify-content-start">
                                <civilization-tile
                                    v-for="(tile, index) in conflictAttackerTiles"
                                    :key="index"
                                    :tile-type="tile.tileType" :size="size"
                                    class="col-auto mr-1 mb-1" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 text-left text-sm-right">
                    <div class="row no-gutters text-center py-2">
                        <div class="col">
                            <strong>Defender</strong>
                        </div>
                    </div>
                    <div class="row no-gutters align-items-center pb-2 pl-sm-1">
                        <div class="col-5 order-3 order-sm-1 small">
                            <strong>Support</strong>
                        </div>
                        <div class="col-5 order-2 small">
                            <strong>Board</strong>
                        </div>
                        <div class="col-2 order-1 order-sm-3"></div>
                    </div>
                    <div class="row no-gutters align-items-center pl-sm-1">
                        <div class="col-5 order-3 order-sm-1">
                            <div class="row no-gutters justify-content-start justify-content-sm-end">
                                <civilization-tile
                                    v-for="(tile, index) in conflictDefenderTiles"
                                    :key="index"
                                    :tile-type="tile.tileType" :size="size"
                                    class="col-auto ml-1 mb-1" />
                            </div>
                        </div>
                        <div class="col-5 order-2">
                            <div class="row no-gutters justify-content-start justify-content-sm-end">
                                <civilization-tile
                                    v-for="(tile, index) in getBoardStrength(conflictDefenderLeader)"
                                    :key="index"
                                    :tile-type="tile.tileType" :size="size"
                                    class="col-auto ml-1 mb-1" />
                            </div>
                        </div>
                        <div class="col-2 order-1 order-sm-3">
                            <div class="row no-gutters align-items-center justify-content-start justify-content-sm-end">
                                <div class="col-auto text-right pl-1 order-2 order-sm-1">
                                    {{ getBoardStrength(conflictDefenderLeader).length + conflictDefenderTiles.length }}
                                </div>
                                <div class="col-auto pl-1 order-1 order-sm-2">
                                    <leader-tile
                                        :size="size"
                                        :tile-type="conflictDefenderLeader.tileType"
                                        :player="getPlayer(conflictDefenderLeader.playerId)"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { breakpoints, actionTypes } from '../common/constants'
import CivilizationTile from './CivilizationTile.vue'
import LeaderTile from './LeaderTile.vue'

export default {
    name: 'WarBoard',
    components: {
        CivilizationTile,
        LeaderTile
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
            'conflictAttackerLeader',
            'conflictDefenderLeader',
            'conflictAttackerTiles',
            'conflictDefenderTiles'
        ]),
        ...mapGetters('game', [
            'currentActionType',
        ])
    },
    methods:{
        onWindowResize() {
            var windowWidth = window.innerWidth;
            this.size = 30
            if (windowWidth <= breakpoints.medium) this.size = 25
            if (windowWidth <= breakpoints.small) this.size = 20
        },
        getPlayer(playerId) {
            return this.$store.getters['players/getPlayer'](playerId)
        },
        getBoardStrength(leader) {
            if (this.currentActionType === actionTypes.revoltAttack ||
                this.currentActionType === actionTypes.revoltDefend
            ) {
                return this.$store.getters['board/getRevoltBoardStrength'](leader)
            }
            return []
        }
    }
}
</script>

<style scoped>
    @media (max-width: 576px) {
        .hide-border {
            border-right: none !important;
        }
    }
    @media (min-width: 576px) {
        .hide-border {
            border-bottom: none !important;
        }
    }
</style>