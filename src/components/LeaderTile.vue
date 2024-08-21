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
        player: Object,
        selected: Boolean,
        highlight: Boolean,
        size: Number,
        showEmpty: Boolean
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
            var leaderClass = helpers.getTileNameByType(this.tileType)
            if (!this.player.leaders.includes(this.tileType) && this.showEmpty) leaderClass += ' empty'
            return leaderClass
        },
        icon() {
            return helpers.getPlayerIconNameById(this.player.id)
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
        box-shadow: 0px 0px 0 1px white ,0 0 0 4px black;
    }
    .highlight {
        box-shadow: 0 0 4px 4px yellow;
    }
    .king {
        color: DimGray;
        stroke: DimGray;
        stroke-width: 0;
    }
    .priest {
        color: darkred;
        stroke: darkred;
        stroke-width: 0;
    }
    .farmer {
        color: dodgerblue;
        stroke: dodgerblue;
        stroke-width: 0;
    }
    .trader {
        color: green;
        stroke: green;
        stroke-width: 0;
    }
    .empty {
        color: GhostWhite;
        stroke-width: 1px;
        stroke-dasharray: 1, 2;
        stroke-linecap: round;
    }
</style>