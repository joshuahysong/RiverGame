<template>
    <div class="tile" :class="tileClass" :style="tileStyle">
        <div v-if="isTreasure" class="treasure-icon"></div>
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
        highlight: Boolean,
        size: Number
    },
    computed: {
        tileClass() {
            let cssClass = helpers.getTileNameByType(this.tileType)
            cssClass += this.selected ? ' selected' : ''
            cssClass += this.highlight ? ' highlight' : ''
            return cssClass
        },
        tileStyle() {
            var style = `height: ${this.size}px; width: ${this.size}px;`
            if (this.tileType == tileTypes.catastrophe) {
                style += `background: repeating-linear-gradient(`
                style += `135deg,`
                style += `#eed202,`
                style += `#eed202 ${this.size/4}px,`
                style += `black ${this.size/4}px,`
                style += `black ${this.size/2}px);`
            }
            return style
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
        z-index: 3;
    }
    .selected {
        box-shadow: 0px 0px 0 4px black;
    }
    .highlight {
        box-shadow: 0 0 4px 4px yellow;
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
    .generic {
        background: #F4A460;
    }
    .treasure-icon {
        height: 35%;
        width: 35%;
        background-color: gold;
        border-radius: 50%;
        border: 2px solid goldenrod;
        top: 32.5%;
        left: 32.5%;
        position: absolute;
    }
</style>