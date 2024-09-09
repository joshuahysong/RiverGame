<template>
    <div class="card">
        <div class="card-header bg-transparent border-0 py-2"><strong>Conflict</strong></div>
        <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
            <div class="row no-gutters align-items-center">
                <div class="col-12 col-lg-6 text-left">
                    <div class="row no-gutters align-items-center pb-2">
                        <div class="col-2">
                            <strong>Attacker</strong>
                        </div>
                        <div class="col-3">
                            <strong>Board</strong>
                        </div>
                        <div class="col-7">
                            <strong>Support</strong>
                        </div>
                    </div>
                    <div class="row no-gutters align-items-center">
                        <div class="col-2">
                            <div class="row no-gutters align-items-center">
                                <div class="col-auto pr-2">
                                <leader-tile
                                    :size="size"
                                    :tile-type="conflictAttackerLeader.tileType"
                                    :player="getPlayer(conflictAttackerLeader.playerId)"/>
                                </div>
                                <div class="col-auto text-left pr-3">
                                    {{ getBoardStrength(conflictAttackerLeader).length + conflictAttackerTiles.length }}
                                </div>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="row no-gutters justify-content-start">
                                <civilization-tile
                                    v-for="(tile, index) in getBoardStrength(conflictAttackerLeader)"
                                    :key="index"
                                    :tile-type="tile.tileType" :size="size"
                                    class="col-auto mr-1" />
                            </div>
                        </div>
                        <div class="col-7">
                            <div class="row no-gutters justify-content-start">
                                <civilization-tile
                                    v-for="(tile, index) in conflictAttackerTiles"
                                    :key="index"
                                    :tile-type="tile.tileType" :size="size"
                                    class="col-auto mr-1" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-6">
                    <div class="row no-gutters align-items-center">
                        <div class="col-auto text-right p-2">
                            {{ getBoardStrength(conflictDefenderLeader).length }}
                        </div>
                        <div class="col-auto">
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
</template>

<script>
import { mapGetters } from 'vuex'
import { breakpoints, actionTypes, tileTypes } from '../common/constants'
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
        ]),
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
            let boardStrength = []
            if (this.currentActionType === actionTypes.revoltAttack ||
                this.currentActionType === actionTypes.revoltDefend
            ) {
                let leaderNeighbors = this.$store.getters['board/getNeighbors'](leader.index)
                if (leaderNeighbors.top && leaderNeighbors.top.tileType === tileTypes.temple)
                    boardStrength.push({ ...leaderNeighbors.top })
                if (leaderNeighbors.right && leaderNeighbors.right.tileType === tileTypes.temple)
                    boardStrength.push({ ...leaderNeighbors.right })
                if (leaderNeighbors.bottom && leaderNeighbors.bottom.tileType === tileTypes.temple)
                    boardStrength.push({ ...leaderNeighbors.bottom })
                if (leaderNeighbors.left && leaderNeighbors.left.tileType === tileTypes.temple)
                    boardStrength.push({ ...leaderNeighbors.left })
            }
            return boardStrength
        }
    }
}
</script>
