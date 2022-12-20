<template>
    <div class="main-app container">
        <div class="row">
            <div class="col">
                <div class="map-container">
                    <div class="grid">
                        <map-square class="cell"
                            v-for="(mapSquare, index) in map"
                            :key="index"
                            :map-square-type="mapSquare"
                            :index="index"
                            :show-coordinates="showCoordinates"
                            :tile="getTile(index)"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <player-hand v-if="currentPlayer?.isHuman" :player="currentPlayer" size="lg" selectable />
                <div v-else class="card">
                    <div class="card-body">
                        <div class="row align-items-center justify-content-center hand-empty">
                            Player {{ currentPlayer?.id }}'s turn
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <b-button
                    variant="primary"
                    :disabled="isEndTurnDisabled"
                    @click="doEndTurn">
                    End Turn
                </b-button>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <b-form-checkbox v-model="showCoordinates">
                    Show Coordinates
                </b-form-checkbox>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <b-button
                    variant="secondary"
                    v-b-toggle.debug-sidebar>
                    Show Debug Info
                </b-button>
            </div>
        </div>
        <b-sidebar
            id="debug-sidebar"
            right shadow
            sidebar-class="border-left border-dark text-left">
            <div class="px-3 py-2">
                Current Player: {{currentPlayer?.id}}<br />
                Bag: {{debugBagStats}}<br />
                Hands: <br />
                <player-hand v-for="(player, index) in allPlayers"
                    :key="index"
                    :player="getPlayer(player.id)" size="sm"
                    :class="{'border-danger': player.id === currentPlayer.id}"
                    class="mt-2"/>
            </div>
        </b-sidebar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MapSquare from './components/MapSquare.vue'
import PlayerHand from './components/PlayerHand.vue'
import helpers from './common/helpers'

export default {
    name: 'App',
    components: {
        MapSquare,
        PlayerHand
    },
    data() {
        return {
            showCoordinates: false
        }
    },
    mounted() {
        this.$store.dispatch('players/createNewPlayer', { isHuman: true })
        this.$store.dispatch('players/createNewPlayer', { isHuman: false })
        this.$store.dispatch('players/createNewPlayer', { isHuman: false })
        this.$store.dispatch('players/createNewPlayer', { isHuman: false })
    },
    computed: {
        ...mapGetters('bag', {
            debugBagStats: 'debugBagStats'
        }),
        ...mapGetters('board', {
            map: 'map',
            tiles: 'tiles'
        }),
        ...mapGetters('players', {
            playerHand: 'playerHand',
            currentPlayer: 'currentPlayer',
            allPlayers: 'all'
        }),
        ...mapGetters('game', {
            remainingActions: 'remainingActions'
        }),
        isEndTurnDisabled() {
            return this.remainingActions != 0
        }
    },
    methods: {
        getTile(index) {
            return this.tiles[index];
        },
        async doEndTurn() {
            await this.$store.dispatch('players/refillPlayerHands')
            this.$store.commit('game/nextActivePlayer')
            if (this.currentPlayer && !this.currentPlayer.isHuman) {
                // TODO Put this in a better spot
                console.log('----------')
                console.log(`AI Turn - ${this.currentPlayer.id}`)
                for (let i = 1; i <= 2; i++) {
                    let tileIndex = Math.floor(Math.random() * this.currentPlayer.hand.length)
                    let availableTileLocations = this.$store.getters['board/availableTileLocations'](this.currentPlayer.hand[tileIndex])
                    let mapIndex = availableTileLocations[Math.floor(Math.random() * availableTileLocations.length)]
                    console.log(`Placing tile ${helpers.getTileNameByType(this.currentPlayer.hand[tileIndex])} at map location ${helpers.getCoordinatesByIndex(mapIndex)} (${mapIndex})`)
                    this.$store.dispatch('players/addTileSelection', { index: tileIndex })
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
        }
    }
}
</script>

<style scoped>
    .main-app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin-top: 50px;
    }

    .map-container {
    background: black;
    display: inline-block;
    border: 5px solid black;
    }

    .grid {
    display: grid;
    grid-template-columns: repeat(16, 60px);
    grid-template-rows: repeat(11, 60px);
    grid-gap: 2px;
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
