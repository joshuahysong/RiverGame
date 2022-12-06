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
                <b-form-checkbox v-model="showCoordinates">
                    Show Coordinates
                </b-form-checkbox>
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
            showCoordinates: false,
            bag: {
                'temple': 47,
                'market': 30,
                'settlement': 30,
                'farm': 36
            },
            selectedHandTile: null
        }
    },
    mounted() {
        // TODO Add AI Players
        this.$store.commit('players/createNewPlayer', { isHuman: true })
    },
    computed: {
        ...mapGetters('board', {
            map: 'map',
            tiles: 'tiles'
        }),
        ...mapGetters('players', {
            playerHand: 'playerHand'
        })
    },
    methods: {
        getTile(index) {
            return this.tiles[index];
        },
        isSelectedHandTile(index) {
            return this.selectedHandTile === index
        },
        selectHandTile(index) {
            this.selectedHandTile = index
            this.$store.dispatch('players/selectTile', { index: index })
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
