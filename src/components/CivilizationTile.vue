<template>
    <div class="tile d-flex mx-auto" :class="tileClass">
        <div v-if="isTreasure" class="treasure-icon mx-auto my-auto"></div>
    </div>
</template>

<script>
import { tileTypes } from '../common/constants'
import helpers from '../common/helpers'

export default {
    name: 'CivilizationTile',
    props: {
        tileType: Number,
        selected: Boolean,
        highlight: Boolean
    },
    computed: {
        tileClass() {
            let cssClass = helpers.getTileNameByType(this.tileType)
            cssClass += this.selected ? ' selected' : ''
            cssClass += this.highlight ? ' highlight' : ''
            return cssClass
        },
        isTreasure() {
            return this.tileType === tileTypes.treasure
        }
    }
}
</script>

<style scoped>
    .tile {
        height: 90%;
        width: 90%;
        border-radius: 4px;
        z-index: 2;
    }
    .selected {
        border: 5px solid black;
        box-sizing: content-box;
    }
    .highlight {
        box-shadow: 0 0 5px 5px yellow;
    }
    .temple, .treasure {
        background: darkred;
    }
    .market {
        background: green;
    }
    .settlement {
        background: DimGray;
    }
    .farm {
        background: dodgerblue;
    }
    .catastrophe {
        background: red;
    }
    .treasure-icon {
        height: 35%;
        width: 35%;
        background-color: gold;
        border-radius: 50%;
        border: 2px solid goldenrod;
    }
</style>