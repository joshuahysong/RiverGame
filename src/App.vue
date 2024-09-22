<template>
    <div>
        <nav-bar @new-game="startNewGame" />
        <!-- main page -->
        <div class="main-app container-fluid text-center mb-5 p-0">
            <action-bar v-if="!showGameEnd" />
            <div v-if="showGameEnd" class="row no-gutters mt-1">
                <div class="col-12 col-xl-10 offset-xl-1">
                    <game-end class="m-1" />
                </div>
            </div>
            <div v-if="showWarBoard" class="row no-gutters mt-2">
                <div class="col-12 col-xl-10 offset-xl-1">
                    <war-board class="m-1" />
                </div>
            </div>
            <div class="row no-gutters mt-2">
                <!-- board column -->
                <div class="col-12 col-lg-9 col-xl-7 order-2 order-xl-1">
                    <div class="map-container">
                        <div class="grid">
                            <map-square class="cell"
                                v-for="(mapSquare, index) in map"
                                :key="index"
                                :map-square-type="mapSquare"
                                :index="index"
                                :tile="getTile(index)"
                            />
                        </div>
                    </div>
                </div>
                <!-- player hand column -->
                <div class="col-12 col-xl-2 order-1 order-xl-2 mb-2 m-xl-0">
                    <div class="row no-gutters justify-content-center align-items-center">
                        <div v-if="showMonumentsAboveHand" class="col-12 col-md-6 mb-2 px-1 d-block d-lg-none">
                            <monument-card />
                        </div>
                        <div class="col-12 col-md-10 col-lg-8 col-xl-12 px-1 px-xl-0 pr-xl-3">
                            <player-hand :player="getPlayer(actionPlayerId)" selectable/>
                        </div>
                        <div class="col-12 mt-3 pr-3 d-none d-xl-block">
                            <monument-card />
                        </div>
                    </div>
                </div>
                <!-- player card column -->
                <div class="col-12 col-lg-3 order-3 ">
                    <div class="row no-gutters">
                        <div v-for="(player, index) in allPlayers"
                            :key="index"
                            :class="index != 0 ? 'mt-2' : 'mt-2 mt-lg-0'"
                            class="col-6 col-lg-12 px-1">
                            <player-card
                                :player="getPlayer(player?.id)"
                                :show-score="player?.id === visiblePlayerId && player?.id === actionPlayerId"
                                :class="{'border-danger': player?.id === actionPlayerId}" />
                        </div>
                        <div class="col-6 col-lg-12 px-1 mt-2 d-block d-xl-none">
                            <monument-card class="h-100" />
                        </div>
                        <div class="col-6 col-lg-12 px-1 mt-2">
                            <progress-card />
                        </div>
                        <div class="col-12 px-1 mt-2">
                            <game-log />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- footer -->
        <b-navbar type="light" variant="light" fixed="bottom" class="border-top py-0">
            <b-navbar-nav class="mx-auto" small>
                <b-nav-text>Version: {{appVersion}}</b-nav-text>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ActionBar from './components/ActionBar.vue'
import GameEnd from './components/GameEnd.vue'
import GameLog from './components/GameLog.vue'
import MapSquare from './components/MapSquare.vue'
import MonumentCard from './components/MonumentCard.vue'
import NavBar from './components/NavBar.vue'
import PlayerHand from './components/PlayerHand.vue'
import PlayerCard from './components/PlayerCard.vue'
import ProgressCard from './components/ProgressCard.vue'
import WarBoard from './components/WarBoard.vue'
import { actionTypes, conflictTypes } from './common/constants'

export default {
    name: 'App',
    components: {
        ActionBar,
        GameEnd,
        GameLog,
        MapSquare,
        MonumentCard,
        NavBar,
        PlayerHand,
        PlayerCard,
        ProgressCard,
        WarBoard
    },
    async mounted() {
        if (this.isSaveValid) {
            this.$store.dispatch('game/load')
        } else {
            await this.startNewGame()
        }
        this.$store.dispatch('settings/load')
    },
    computed: {
        ...mapGetters('board', [
            'map',
            'tiles'
        ]),
        ...mapGetters('players', {
            allPlayers: 'all'
        }),
        ...mapGetters('game', [
            'isSaveValid',
            'visiblePlayerId',
            'currentActionType',
            'actionPlayerId',
            'conflictType'
        ]),
        appVersion() {
            return process.env.VUE_APP_VERSION
        },
        showMonumentsAboveHand() {
            return this.currentActionType === actionTypes.buildMonument ||
                this.currentActionType === actionTypes.buildMonumentMultiple
        },
        showWarBoard() {
            return this.conflictType !== conflictTypes.none
        },
        showGameEnd() {
            return this.currentActionType === actionTypes.gameOver
        }
    },
    methods: {
        getTile(index) {
            return this.tiles[index];
        },
        getPlayer(id) {
            let matchingPlayers = this.allPlayers.filter(x => x.id == id)
            if (matchingPlayers && matchingPlayers.length > 0) {
                return matchingPlayers[0]
            }
            return null
        },
        async startNewGame() {
            localStorage.removeItem('gameState')
            this.$store.commit('log/init')
            this.$store.dispatch('game/init')
            this.$store.dispatch('board/init')
            this.$store.dispatch('bag/init')
            this.$store.commit('players/clearPlayers')
            await this.$store.dispatch('players/createNewPlayer', { name: 'Test Player 1', isHuman: true })
            await this.$store.dispatch('players/createNewPlayer', { name: 'Test Player 2', isHuman: true })
            await this.$store.dispatch('players/createNewPlayer', { name: 'Test Player 3', isHuman: true })
            await this.$store.dispatch('players/createNewPlayer', { name: 'Test Player 4', isHuman: true })
            this.$store.commit('bag/setStartingBag')
            this.$store.dispatch('game/save')
            this.$store.commit('log/logSystemMessage', 'New Game Started')
        }
    }
}
</script>

<style scoped>
    .main-app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .map-container {
        background: black;
        display: inline-block;
        border: 5px solid black;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(16, calc(50vw / 16));
        grid-template-rows: repeat(11, calc(50vw / 16));
        grid-gap: 2px;
    }

    @media (max-width: 1199.98px) {
        .grid {
            display: grid;
            grid-template-columns: repeat(16, calc(70vw / 16));
            grid-template-rows: repeat(11, calc(70vw / 16));
            grid-gap: 2px;
        }
    }

    @media (max-width: 767.98px) {
        .grid {
            display: grid;
            grid-template-columns: repeat(16, calc(90vw / 16));
            grid-template-rows: repeat(11, calc(90vw / 16));
            grid-gap: 1px;
        }
    }

    .cell {
        justify-content: center;
        align-items: center;
        display: flex;
    }
</style>

<style>
    .pointer {
        cursor: pointer !important;
    }
    .disabled {
        opacity: 0.5;
        pointer-events: none;
    }
</style>
