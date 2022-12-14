<template>
    <div>
        <b-navbar toggleable="sm" type="dark" variant="dark">
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-button size="sm" class="my-2 my-sm-0 mx-2" @click="startNewGame">New Game</b-button>
                <b-navbar-nav class="ml-auto">
                    <b-dropdown right>
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
                    </b-dropdown>
                    <b-button size="sm" class="my-2 my-sm-0 mx-2" v-b-toggle.debug-sidebar>Debug</b-button>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div class="main-app container-fluid text-center mt-3">
            <div class="row">
                <div class="col p-0">
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
            </div>
            <div v-if="showPlayerMessage" class="row mt-3">
                <div class="col">
                    <b-icon v-if="playerMessageId" :icon="leaderIcon" /> {{playerMessage}}
                </div>
            </div>
            <div class="row justify-content-center align-items-center mt-3">
                <div class="col-12 col-sm-6 col-md-1 py-3 order-3 order-sm-2 order-md-1 d-flex justify-content-center">
                    <div class="bag-icon-container" >
                        <b-icon-bag-fill class="bag-icon" variant="dark" />
                        <div class="bag-text text-white">{{ bagSpaceRemaining }}%</div>
                    </div>
                </div>
                <div class="col-auto order-1 order-sm-1 order-md-2">
                    <player-hand v-if="currentPlayer?.isHuman" :player="currentPlayer" size="lg" selectable />
                    <div v-else class="card">
                        <div class="card-body">
                            <div class="row align-items-center justify-content-center hand-empty">
                                Player {{ currentPlayer?.id }}'s turn
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-2 py-3 order-2 order-sm-3 order-md-3">
                    <b-button
                        variant="primary"
                        :disabled="isEndTurnDisabled"
                        @click="doEndTurn">
                        End Turn
                    </b-button>
                </div>
            </div>
            <b-sidebar
                id="debug-sidebar"
                right shadow no-header
                sidebar-class="border-left border-dark text-left mt-5">
                <div class="px-3 py-2">
                    Current Player: {{currentPlayer?.id}}<br />
                    Number of Players: {{ numberOfPlayers }}<br />
                    Bag: {{debugBagStats}}<br />
                    Hands: <br />
                    <player-hand v-for="(player, index) in allPlayers"
                        :key="index"
                        :player="getPlayer(player?.id)" size="sm"
                        :class="{'border-danger': player?.id === currentPlayer.id}"
                        class="mt-2"/>
                </div>
            </b-sidebar>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MapSquare from './components/MapSquare.vue'
import PlayerHand from './components/PlayerHand.vue'
import helpers from './common/helpers'
import { actionTypes } from './common/constants'

export default {
    name: 'App',
    components: {
        MapSquare,
        PlayerHand
    },
    data() {
        return {
            showPlayerMessage: false,
            playerMessage: '',
            playerMessageId: 0
        }
    },
    async mounted() {
        if (localStorage.gameState) {
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
            'boardSelectionPlayerId'
        ]),
        ...mapGetters('players', {
            playerHand: 'playerHand',
            currentPlayer: 'currentPlayer',
            allPlayers: 'all'
        }),
        ...mapGetters('game', [
            'remainingActions',
            'numberOfPlayers',
            'currentActionType'
        ]),
        isEndTurnDisabled() {
            return this.remainingActions != 0
        },
        leaderIcon() {
            return helpers.getPlayerIconNameById(this.playerMessageId)
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
    watch: {
        currentActionType(newActionType) {
            this.showPlayerMessage = false
            this.playerMessage = ''
            this.playerMessageId = 0
            if (newActionType == actionTypes.takeTreasure) {
                this.showPlayerMessage = true
                this.playerMessage = 'Select which treasure to take'
                this.playerMessageId = this.boardSelectionPlayerId
            }
        }
    },
    methods: {
        getTile(index) {
            return this.tiles[index];
        },
        async doEndTurn() {
            await this.$store.dispatch('players/refillPlayerHands')
            this.$store.commit('game/nextActivePlayer')
            this.$store.dispatch('game/saveGame')
            if (this.currentPlayer && !this.currentPlayer.isHuman) {
                // TODO Put this in a better spot
                console.log('----------')
                console.log(`AI Turn - ${this.currentPlayer.id}`)
                for (let i = 1; i <= 2; i++) {
                    let tileIndex = Math.floor(Math.random() * this.currentPlayer.hand.length)
                    this.$store.dispatch('players/addTileSelection', { index: tileIndex })
                    let availableTileLocations = this.$store.getters['board/availableTileLocations'](this.currentPlayer.selectedTiles[0])
                    let mapIndex = availableTileLocations[Math.floor(Math.random() * availableTileLocations.length)]
                    console.log(`Placing tile ${helpers.getTileNameByType(this.currentPlayer.hand[tileIndex])} at map location ${helpers.getCoordinatesByIndex(mapIndex)} (${mapIndex})`)
                    this.$store.dispatch('board/handleBoardClick', { index: mapIndex })
                    // TODO Add a slight delay so human player can "watch" the turn unfold
                }
                await this.doEndTurn()
            }
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
            await this.$store.dispatch('players/createNewPlayer', { isHuman: true })
            await this.$store.dispatch('players/createNewPlayer', { isHuman: true })
            await this.$store.dispatch('players/createNewPlayer', { isHuman: true })
            await this.$store.dispatch('players/createNewPlayer', { isHuman: true })
            this.$store.dispatch('game/save')
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
