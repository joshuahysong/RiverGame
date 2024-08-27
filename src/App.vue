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
            <action-bar></action-bar>
            <div class="row no-gutters mt-2">
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
                <div class="col-12 col-xl-2 order-1 order-xl-2 mb-2 m-xl-0">
                    <div class="row no-gutters justify-content-center align-items-center">
                        <div v-if="showMonumentsBelowHand" class="col-12 col-md-6 mb-2 px-1 d-block d-lg-none">
                            <monument-card />
                        </div>
                        <div class="col-12 col-md-10 col-lg-8 col-xl-12 pr-xl-3 px-1">
                            <player-hand v-if="currentPlayer?.isHuman"
                                :player="getPlayer(currentHandDisplayPlayerId)" selectable/>
                            <div v-else class="card">
                                <div class="card-body">
                                    <div class="row align-items-center justify-content-center hand-empty">
                                        Player {{ currentPlayer?.id }}'s turn
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 mt-3 pr-3 d-none d-xl-block">
                            <monument-card />
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-3 order-3 ">
                    <div class="row no-gutters">
                        <div v-for="(player, index) in allPlayers"
                            :key="index"
                            :class="index != 0 ? 'mt-2' : 'mt-2 mt-lg-0'"
                            class="col-6 col-lg-12 px-1">
                            <player-card
                                :player="getPlayer(player?.id)"
                                :show-score="player?.id === currentPlayer.id"
                                :class="{'border-danger': player?.id === currentPlayer.id}" />
                        </div>
                        <div class="col-6 col-lg-12 px-1 mt-2 d-block d-xl-none">
                            <monument-card class="h-100" />
                        </div>
                        <div class="col-6 col-lg-12 px-1 mt-2">
                            <div class="card">
                                <div class="card-header bg-transparent border-0 py-2"><strong>Progress</strong></div>
                                <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
                                    <div class="row no-gutters">
                                        <div class="col-12 col-sm-4 small">Bag</div>
                                        <div class="col-12 col-sm">
                                            <b-progress max="100" height="1.5rem">
                                                <div class="progress-foreground progress-bar bg-success"
                                                    :style="`clip-path: inset(0 ${100-Math.round((bagSpaceRemaining / 100) * 100)}% 0 0);`"
                                                    aria-hidden="true">{{Math.round((bagSpaceRemaining / 100) * 100)}}%</div>
                                                <div class="progress-background"
                                                    :style="`clip-path: inset(0 0 0 ${Math.round((bagSpaceRemaining / 100) * 100)}%);`"
                                                    aria-hidden="true">{{Math.round((bagSpaceRemaining / 100) * 100)}}%</div>
                                            </b-progress>
                                        </div>
                                    </div>
                                    <div class="row no-gutters mt-2">
                                        <div class="col-12 col-sm-4 small">Treasures</div>
                                        <div class="col-12 col-sm">
                                            <b-progress :max="initialTreasures" height="1.5rem">
                                                <div class="progress-foreground progress-bar bg-success"
                                                    :style="`clip-path: inset(0 ${((initialTreasures-remainingTreasures)/initialTreasures*100)}% 0 0);`"
                                                    aria-hidden="true">{{remainingTreasures}} of {{initialTreasures}}</div>
                                                <div class="progress-background"
                                                    :style="`clip-path: inset(0 0 0 ${(remainingTreasures/initialTreasures*100)}%);`"
                                                    aria-hidden="true">{{remainingTreasures}} of {{initialTreasures}}</div>
                                            </b-progress>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row no-gutters mt-2">
                <div class="col-12 col-sm-8 col-lg-4 offset-0 offset-sm-2 mt-2 px-1">
                    <div class="card">
                        <div class="card-header bg-transparent py-2"><strong>Missing MVP Features</strong></div>
                        <div class="card-body px-2 pb-1 pb-md-2 pt-0 pt-md-1">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Moving Leaders</li>
                                <li class="list-group-item">Game Log</li>
                                <li class="list-group-item">Undo Button</li>
                                <li class="list-group-item">Revolts</li>
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
                    Current Turn PlayerId: {{currentPlayer?.id}}<br />
                    Current Hand PlayerId: {{ currentHandDisplayPlayerId }}<br />
                    Current Action PlayerId: {{ currentActionPlayerId }}<br />
                    Bag: {{debugBagStats}}<br />
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
import MapSquare from './components/MapSquare.vue'
import PlayerHand from './components/PlayerHand.vue'
import PlayerCard from './components/PlayerCard.vue'
import ActionBar from './components/ActionBar.vue'
import MonumentCard from './components/MonumentCard.vue'
import helpers from './common/helpers'
import { actionTypes, tileTypes } from './common/constants'

export default {
    name: 'App',
    components: {
        MapSquare,
        PlayerHand,
        PlayerCard,
        ActionBar,
        MonumentCard
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
            'debugBagStats',
            'bagSpaceRemaining'
        ]),
        ...mapGetters('board', [
            'map',
            'tiles',
            'initialTreasures'
        ]),
        ...mapGetters('players', {
            currentPlayer: 'currentPlayer',
            allPlayers: 'all'
        }),
        ...mapGetters('game', [
            'debug',
            'isSaveValid',
            'numberOfPlayers',
            'currentActionType',
            'currentHandDisplayPlayerId',
            'currentActionPlayerId',
            'conflictDefenderPlayerId'
        ]),
        leaderIcon() {
            return helpers.getPlayerIconNameById(this.messagePlayerId)
        },
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
        showMonumentsBelowHand() {
            return this.currentActionType === actionTypes.buildMonument ||
                this.currentActionType === actionTypes.buildMonumentMultiple
        },
        remainingTreasures() {
            return this.tiles.filter(x => x.tileType === tileTypes.treasure).length
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
        },
        saveSettings() {
            this.$store.dispatch('settings/save')
        },
        commitTilesToRevolt() {
            // Add attacker selected tiles to conflict
            this.$store.dispatch('players/removeSelectedTiles', { playerId: this.currentActionPlayerId })
            this.$store.commit('game/setCurrentActionPlayerId', { playerId: this.conflictDefenderPlayerId })
            this.$store.commit('game/setCurrentHandDisplayPlayerId', { playerId: this.conflictDefenderPlayerId })
            this.$store.commit('game/setActionType', { actionType: actionTypes.revoltDefend })
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

    .progress-foreground {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        color: white;
    }

    .progress-background {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        color: black;
    }
</style>

<style>
    .pointer {
        cursor: pointer !important;
    }
</style>
