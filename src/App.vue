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
                <div class="card mx-5">
                    <div class="card-body">
                        <div class="row align-items-center justify-content-center hand">
                            <div v-for="(tile, index) in playerHand"
                                :key="index"
                                class="col-auto">
                                <civilization-tile                                
                                    class="tile"
                                    :class="{'selected-tile': isSelectedHandTile(index) }"
                                    :tile="tile"
                                    @click.native="selectHandTile(index)" />
                            </div>
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
                <div class="card">
                    <div class="card-header">
                        Debug Info
                    </div>
                    <div class="card-body">
                        Current Player: {{currentPlayer?.id}}
                        Bag: {{debugBagStats}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CivilizationTile from './components/CivilizationTile.vue'
import MapSquare from './components/MapSquare.vue'

export default {
    name: 'App',
    components: {
        CivilizationTile,
        MapSquare
    },
    data() {
        return {
            showCoordinates: false
        }
    },
    mounted() {
        // TODO Add AI Players
        this.$store.dispatch('players/createNewPlayer', { isHuman: true })
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
            currentPlayer: 'currentPlayer'
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
        isSelectedHandTile(index) {
            return this.currentPlayer.selectedTiles.some(x => x.index === index)
        },
        selectHandTile(index) {
            if (this.remainingActions > 0) {
                this.$store.dispatch('players/addTileSelection', { index: index })
            }
        },
        doEndTurn() {
            // TODO We need to get a promise here to know when "End Turn" actions are done.
            // There is potential for a timing issue with refilling the player hands
            this.$store.dispatch('players/refillPlayerHands')
            this.$store.commit('game/nextActivePlayer')
        }
    }
}
</script>

<style>
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

.hand {
    height: 80px;
}

.tile {
    height: 60px;
    width: 60px;
}

.selected-tile {
    border: 5px solid black;
    box-sizing: content-box;
}
</style>
