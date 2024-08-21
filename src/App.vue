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
                <b-button v-if="showDebug" size="sm" class="my-2 my-sm-0 mx-2" v-b-toggle.debug-sidebar>Debug</b-button>
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
                        <div class="col-12 col-md-10 col-lg-8 col-xl-auto pr-xl-3 px-1">
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
                    </div>
                </div>
                <div class="col-12 col-lg-3 order-3">
                    <div class="row no-gutters">
                        <div v-for="(player, index) in allPlayers"
                            :key="index"
                            :class="index != 0 ? 'mt-2' : 'mt-2 mt-lg-0'"
                            class="col-12 col-sm-6 col-lg-12 px-1">
                            <player-card
                                :player="getPlayer(player?.id)"
                                :show-score="player?.id === currentPlayer.id"
                                :class="{'border-danger': player?.id === currentPlayer.id}" />
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
                    Hands: <br />
                    <player-hand v-for="(player, index) in allPlayers"
                        :key="index"
                        :player="getPlayer(player?.id)"
                        :size="20"
                        :class="{'border-danger': player?.id === currentPlayer.id}"
                        class="mt-2"/>
                </div>
            </b-sidebar>
        </div>
        <!-- footer -->
        <b-navbar type="light" variant="light" fixed="bottom" class="border-top py-0">
            <b-navbar-nav class="mx-auto" small>
                <b-nav-text>Version: {{appVersion}}</b-nav-text>
            </b-navbar-nav>
        </b-navbar>
        <!-- modals -->
        <b-modal id="bv-modal-example" title="Revolt Results" centered hide-backdrop hide-footer header-class="border-bottom-0" footer-class="border-top-0">
            Revolt Results
        </b-modal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MapSquare from './components/MapSquare.vue'
import PlayerHand from './components/PlayerHand.vue'
import PlayerCard from './components/PlayerCard.vue'
import ActionBar from './components/ActionBar.vue'
import helpers from './common/helpers'
import { actionTypes } from './common/constants'

export default {
    name: 'App',
    components: {
        MapSquare,
        PlayerHand,
        PlayerCard,
        ActionBar
    },
    data() {
        return {
            showDebug: false,
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
            currentPlayer: 'currentPlayer',
            allPlayers: 'all'
        }),
        ...mapGetters('game', [
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
    .bg-table {
        background-color: red;
    }
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
    .bag-icon-container {
        position: relative;
    }
    .bag-icon {
        width: 4em;
        height: 4em;
    }
    .bag-text {
        width: 100%;
        position: absolute;
        top: 1.7rem;
    }
</style>
