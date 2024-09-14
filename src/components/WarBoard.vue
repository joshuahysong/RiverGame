<template>
    <div class="card">
        <div class="card-body p-0">
            <div class="row no-gutters align-items-center">
                <div v-if="conflictAttackerLeader"
                    class="col-12 col-sm-6 text-left border-bottom border-right hide-border pb-1 pb-md-2 px-2 pr-sm-0 pl-sm-2"
                    :class="getResultClass(conflictAttackerLeader)">
                    <div class="row no-gutters text-center pt-2">
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
                            <strong>Committed</strong>
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
                                    {{ conflictAttackerBoardTiles.length + conflictAttackerTiles.length }}
                                </div>
                            </div>
                        </div>
                        <div class="col-5">
                            <div class="row no-gutters justify-content-start">
                                <civilization-tile
                                    v-for="(tile, index) in conflictAttackerBoardTiles"
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
                <div v-if="conflictDefenderLeader"
                    class="col-12 col-sm-6 text-left text-sm-right pb-1 pb-md-2 px-2 pl-sm-0 pr-sm-2"
                    :class="getResultClass(conflictDefenderLeader)">
                    <div class="row no-gutters text-center pt-2">
                        <div class="col">
                            <strong>Defender</strong>
                        </div>
                    </div>
                    <div class="row no-gutters align-items-center pb-2 pl-sm-1">
                        <div class="col-5 order-3 order-sm-1 small">
                            <strong>Committed</strong>
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
                                    class="col-auto mr-1 mr-sm-0 ml-0 ml-sm-1 mb-1" />
                            </div>
                        </div>
                        <div class="col-5 order-2">
                            <div class="row no-gutters justify-content-start justify-content-sm-end">
                                <civilization-tile
                                    v-for="(tile, index) in conflictDefenderBoardTiles"
                                    :key="index"
                                    :tile-type="tile.tileType" :size="size"
                                    class="col-auto mr-1 mr-sm-0 ml-0 ml-sm-1 mb-1" />
                            </div>
                        </div>
                        <div class="col-2 order-1 order-sm-3">
                            <div class="row no-gutters align-items-center justify-content-start justify-content-sm-end">
                                <div class="col-auto text-right pr-1 pr-sm-0 pl-0 pl-sm-1 order-2 order-sm-1">
                                    {{ conflictDefenderBoardTiles.length + conflictDefenderTiles.length }}
                                </div>
                                <div class="col-auto pr-1 pr-sm-0 pl-0 pl-sm-1 order-1 order-sm-2">
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
        <div v-if="conflictWinnerPlayerId" class="card-footer bg-white p-2 small">
            <div class="row no-gutters align-items-center justify-content-center">
                <div class="col-auto">
                    <span class="mr-3"><strong>{{ getPlayer(conflictWinnerPlayerId)?.name }}</strong> wins the conflict!</span>
                </div>
                <div class="col-auto">
                    <b-button
                        variant="success"
                        size="sm"
                        @click="closeWarBoard">
                        Continue
                    </b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { breakpoints, conflictTypes } from '../common/constants'
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
            'conflictDefenderTiles',
            'conflictAttackerBoardTiles',
            'conflictDefenderBoardTiles',
            'conflictType',
            'conflictWinnerPlayerId'
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
        closeWarBoard() {
            this.$store.commit('game/resetConflictData')
            this.$store.commit('game/setConflictType', conflictTypes.none)
        },
        getResultClass(leader) {
            if (!this.conflictWinnerPlayerId) return ''
            if (leader.playerId === this.conflictWinnerPlayerId) return 'winner'
            return 'loser'
        }
    }
}
</script>

<style scoped>
    .winner {
        background-color: #c9e9d1;
    }

    .loser {
        background-color: #f6ccd1
    }

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