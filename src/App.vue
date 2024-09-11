<template>
    <div>
        <!-- navbar -->
        <b-navbar toggleable="sm" type="dark" variant="dark" sticky>
            <b-button size="sm" @click="startNewGame">New Game</b-button>
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <template #button-content>
                        <b-icon-gear-fill />
                    </template>
                    <b-dropdown-form form-class="px-3" style="width: 170px">
                        <b-form-checkbox v-model="showCoordinates" class="small" @change="saveSettings">
                            Show Coordinates
                        </b-form-checkbox>
                        <b-form-checkbox v-model="showIndexes" class="small" @change="saveSettings">
                            Show Indexes
                        </b-form-checkbox>
                        <b-form-checkbox v-model="showKingdoms" class="small" @change="saveSettings">
                            Show Kingdoms
                        </b-form-checkbox>
                    </b-dropdown-form>
                </b-nav-item-dropdown>
                <b-button v-if="debug" size="sm" class="my-2 my-sm-0 mx-2" v-b-toggle.debug-sidebar>Debug</b-button>
            </b-navbar-nav>
        </b-navbar>
        <!-- main page -->
        <div class="main-app container-fluid text-center mb-5 p-0">
            <action-bar />
            <div class="row no-gutters mt-2">
                <div class="col-12 col-xl-10 offset-xl-1">
                    <war-board v-if="showWarBoard" class="m-1" />
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
                        <div class="col-12 col-md-10 col-lg-8 col-xl-12 pr-xl-3 px-1">
                            <player-hand v-if="getPlayer(currentHandDisplayPlayerId)?.isHuman"
                                :player="getPlayer(currentHandDisplayPlayerId)" selectable/>
                            <div v-else class="card">
                                <div class="card-body">
                                    <div class="row align-items-center justify-content-center hand-empty">
                                        Player {{ currentActionPlayerId }}'s turn
                                    </div>
                                </div>
                            </div>
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
                                :show-score="player?.id === currentActionPlayerId"
                                :class="{'border-danger': player?.id === currentActionPlayerId}" />
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
            <!-- Temprary feature list -->
            <div class="row no-gutters mt-2">
                <div class="col-12 col-sm-8 col-lg-4 offset-0 offset-sm-2 mt-2 px-1">
                    <div class="card">
                        <div class="card-header bg-transparent py-2"><strong>Missing MVP Features</strong></div>
                        <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Wars</li>
                                <li class="list-group-item">Bots</li>
                                <li class="list-group-item">Game Setup Screen</li>
                                <li class="list-group-item">Game End</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <b-sidebar
                id="debug-sidebar"
                right shadow no-header
                sidebar-class="border-left border-dark text-left mt-5">
                <div class="px-3 py-2">
                    Number of Players: {{ numberOfPlayers }}<br />
                    Current Action Type: {{ actionTypeName }}<br />
                    Current Turn PlayerId: {{ activeTurnPlayerId }}<br />
                    Current Hand PlayerId: {{ currentHandDisplayPlayerId }}<br />
                    Current Action PlayerId: {{ currentActionPlayerId }}<br />
                    Bag: {{ debugBagStats }}<br />
                </div>
            </b-sidebar>
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
import GameLog from './components/GameLog.vue'
import MapSquare from './components/MapSquare.vue'
import MonumentCard from './components/MonumentCard.vue'
import PlayerHand from './components/PlayerHand.vue'
import PlayerCard from './components/PlayerCard.vue'
import ProgressCard from './components/ProgressCard.vue'
import WarBoard from './components/WarBoard.vue'
import helpers from './common/helpers'
import { actionTypes } from './common/constants'

export default {
    name: 'App',
    components: {
        ActionBar,
        GameLog,
        MapSquare,
        MonumentCard,
        PlayerHand,
        PlayerCard,
        ProgressCard,
        WarBoard
    },
    data() {
        return {
            showPlayerMessage: false,
            playerMessage: '',
            showPlayerActionButton: false,
            messagePlayerId: 0
        }
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
        ...mapGetters('bag', [
            'debugBagStats'
        ]),
        ...mapGetters('board', [
            'map',
            'tiles'
        ]),
        ...mapGetters('players', {
            allPlayers: 'all'
        }),
        ...mapGetters('game', [
            'debug',
            'isSaveValid',
            'numberOfPlayers',
            'activeTurnPlayerId',
            'currentActionType',
            'currentHandDisplayPlayerId',
            'currentActionPlayerId'
        ]),
        actionTypeName() {
            return helpers.getActionNameByType(this.currentActionType)
        },
        appVersion() {
            return process.env.VUE_APP_VERSION
        },
        showCoordinates: {
            get () {
                return this.$store.getters['settings/showCoordinates']
            },
            set (value) {
                this.$store.commit('settings/setShowCoordinates', value)
            }
        },
        showIndexes: {
            get () {
                return this.$store.getters['settings/showIndexes']
            },
            set (value) {
                this.$store.commit('settings/setShowIndexes', value)
            }
        },
        showKingdoms: {
            get () {
                return this.$store.getters['settings/showKingdoms']
            },
            set (value) {
                this.$store.commit('settings/setShowKingdoms', value)
            }
        },
        showMonumentsAboveHand() {
            return this.currentActionType === actionTypes.buildMonument ||
                this.currentActionType === actionTypes.buildMonumentMultiple
        },
        showWarBoard() {
            return this.currentActionType === actionTypes.revoltAttack ||
                this.currentActionType === actionTypes.revoltDefend
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
        },
        saveSettings() {
            this.$store.dispatch('settings/save')
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

    .hand-empty {
        height: 80px;
    }
</style>

<style>
    .pointer {
        cursor: pointer !important;
    }
</style>
