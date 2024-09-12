<template>
    <div>
        <b-iconstack class="tile-monument" :style="monumentStyle" :class="monumentClass">
            <b-icon stacked icon="octagon-fill" :class="primaryTileClass"></b-icon>
            <b-icon stacked icon="octagon-fill" scale="0.4" :class="secondaryTileClass"></b-icon>
        </b-iconstack>
    </div>
</template>

<script>
import helpers from '../common/helpers'
import { tileTypes, monumentTypes } from '../common/constants'

export default {
    name: 'MonumentTile',
    props: {
        size: Number,
        selected: Boolean,
        disabled: Boolean,
        showPointer: Boolean,
        monumentType: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            primaryTileType: tileTypes.empty,
            secondaryTileType: tileTypes.empty
        }
    },
    mounted() {
        switch (this.monumentType) {
            case monumentTypes.redBlue:
                this.primaryTileType = tileTypes.temple
                this.secondaryTileType = tileTypes.farm
                break;
            case monumentTypes.blueGreen:
                this.primaryTileType = tileTypes.farm
                this.secondaryTileType = tileTypes.market
                break;
            case monumentTypes.greenRed:
                this.primaryTileType = tileTypes.market
                this.secondaryTileType = tileTypes.temple
                break;
            case monumentTypes.blackRed:
                this.primaryTileType = tileTypes.settlement
                this.secondaryTileType = tileTypes.temple
                break;
            case monumentTypes.blackGreen:
                this.primaryTileType = tileTypes.settlement
                this.secondaryTileType = tileTypes.market
                break;
            case monumentTypes.blackBlue:
                this.primaryTileType = tileTypes.settlement
                this.secondaryTileType = tileTypes.farm
                break;
        }
    },
    computed: {
        primaryTileClass() {
            return `${helpers.getTileNameByType(this.primaryTileType)}-monument`
        },
        secondaryTileClass() {
            return `${helpers.getTileNameByType(this.secondaryTileType)}-monument`
        },
        monumentStyle() {
            let style = ''
            if (this.size) style += `height: ${this.size}px; width: ${this.size}px;`
            return style
        },
        monumentClass() {
            let monumentClass = ''
            monumentClass += this.selected ? ' selected' : ''
            monumentClass += this.disabled ? ' disabled' : ''
            monumentClass += this.showPointer && !this.disabled ? ' pointer' : ''
            return monumentClass
        }
    }
}
</script>

<style lang="scss" scoped>
    .selected {
        border-radius: 4px;
        box-shadow: 0 0 0 2px white, 0 0 0 5px red;
    }
    .disabled {
        opacity: 0.5;
        pointer-events: none;
    }
    .tile-monument {
        height: 100%;
        width: 100%;
    }
    .temple-monument {
        color: $color-temple;
    }
    .market-monument {
        color: $color-market;
    }
    .settlement-monument {
        color: $color-settlement;
    }
    .farm-monument {
        color: $color-farm;
    }
</style>