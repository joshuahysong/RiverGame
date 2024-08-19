<template>
    <div class="tile d-inline-block" :class="tileClass" :style="tileStyle">
        <b-icon class="h-100 w-100" :icon="icon" :class="iconClass" />
    </div>
</template>

<script>
import helpers from '../common/helpers'

export default {
    name: 'LeaderTile',
    props: {
        tileType: Number,
        playerId: Number,
        selected: Boolean,
        highlight: Boolean,
        size: Number
    },
    computed: {
        tileClass() {
            let cssClass = this.selected ? 'selected' : ''
            cssClass += this.highlight ? ' highlight' : ''
            return cssClass
        },
        tileStyle() {
            return `height: ${this.size}px; width: ${this.size}px;`
        },
        iconClass() {
            return helpers.getTileNameByType(this.tileType)
        },
        icon() {
            return helpers.getPlayerIconNameById(this.playerId)
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
        box-shadow: 0px 0px 0 1px white ,0 0 0 5px black;
    }
    .highlight {
        box-shadow: 0 0 5px 5px yellow;
    }
    .king {
        color: DimGray;
    }
    .priest {
        color: darkred;
    }
    .farmer {
        color: dodgerblue;
    }
    .trader {
        color: green;
    }
</style>