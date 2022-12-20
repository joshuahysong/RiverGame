<template>
    <div class="tile d-flex mx-auto" :class="tileClass"
        :style="{
            'height': `${size}px`,
            'width':  `${size}px`
        }"
    >
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
        size: Number,
        selected: Boolean
    },
    computed: {
        tileClass() {
            let cssClass = ''
            cssClass += helpers.getTileNameByType(this.tileType)
            if (this.selected){
                cssClass += ' selected'
            }
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
    }
    .selected {
        border: 5px solid black;
        box-sizing: content-box;
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
        background: Yellow;
    }
    .treasure-icon {
        height: 35%;
        width: 35%;
        background-color: gold;
        border-radius: 50%;
        border: 2px solid goldenrod;
    }
</style>