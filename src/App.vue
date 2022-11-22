<template>
    <div class="main-app container">
        <div class="row">
            <div class="col">
                <div class="map-container">
                    <div class="grid">
                        <map-square class="cell"
                            v-for="(mapSquare, index) in mapSquares"
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
                            <div v-for="(tile, index) in getHand('player')"
                                :key="index"
                                class="col-auto">
                                <civilization-tile                                
                                    class="tile"
                                    :class="{'selected-tile': isSelectedHandTile(index) }"
                                    :tile="tile"
                                    @click.native="selectedHandTile = index" />
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
            mapSquares: [
                0,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,
                0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,
                0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,
                1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
                1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,
                0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,
                0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
            ],
            tiles: [
                0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,
                0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
                0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
                0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,
                //2,3,4,5,6,0,0,0,0,0,1,0,0,0,0,0
            ],
            bag: {
                'temple': 47,
                'market': 30,
                'settlement': 30,
                'farm': 36
            },
            hands: {
                player: [2,2,3,4,5,6]
            },
            selectedHandTile: 10
        }
    },
    methods: {
        getTile(index) {
            return this.tiles[index];
        },
        getHand(playerName){
            return this.hands[playerName]; 
        },
        isSelectedHandTile(index) {
            return this.selectedHandTile === index
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
