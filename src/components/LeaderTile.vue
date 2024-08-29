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
        showPointer: Boolean,
        size: Number,
        showEmpty: Boolean
    },
    computed: {
        tileClass() {
            let cssClass = this.selected ? 'selected' : ''
            cssClass += this.highlight ? ' highlight' : ''
            cssClass += (this.showPointer && !this.isEmpty) || this.highlight ? ' pointer' : ''
            return cssClass
        },
        tileStyle() {
            return this.size ? `height: ${this.size}px; width: ${this.size}px;` : ''
        },
        iconClass() {
            var leaderClass = helpers.getTileNameByType(this.tileType)
            if (this.isEmpty) leaderClass += ' empty'
            return leaderClass
        },
        icon() {
            return helpers.getPlayerIconNameById(this.player.id)
        },
        isEmpty() {
            return !this.player.leaders.includes(this.tileType) && this.showEmpty
        }
    }
}
</script>

<style lang="scss" scoped>
    .tile {
        height: 90%;
        width: 90%;
        border-radius: 4px;
        z-index: 3;
    }
    .selected {
        box-shadow: 0 0 0 1px white, 0 0 0 4px red;
    }
    .highlight {
        box-shadow: 0 0 4px 4px yellow;
    }
    .king {
        color: $color-settlement;
        stroke: $color-settlement;
        stroke-width: 0;
    }
    .priest {
        color: $color-temple;
        stroke: $color-temple;
        stroke-width: 0;
    }
    .farmer {
        color: $color-farm;
        stroke: $color-farm;
        stroke-width: 0;
    }
    .trader {
        color: $color-market;
        stroke: $color-market;
        stroke-width: 0;
    }
    .empty {
        color: GhostWhite;
        stroke-width: 1px;
        stroke-dasharray: 1, 2;
        stroke-linecap: round;
    }
</style>