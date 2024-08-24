<template>
    <div>
        <b-iconstack class="tile-monument" :style="tileStyle">
            <b-icon stacked icon="octagon-fill" :class="primaryTileClass"></b-icon>
            <b-icon stacked icon="circle-fill" scale="0.4" :class="secondaryTileClass"></b-icon>
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
        tileStyle() {
            let style = ''
            if (this.size) style += `height: ${this.size}px; width: ${this.size}px;`
            return style
        },
    }
}
</script>

<style scoped>
    .tile-monument {
        height: 100%;
        width: 100%;
    }
    .temple-monument {
        color: darkred;
    }
    .market-monument {
        color: green;
    }
    .settlement-monument {
        color: #202020;
    }
    .farm-monument {
        color: dodgerblue;
    }
    .secondary {
        color: yellow;
        stroke: darkred;
        stroke-width: 1px;
        stroke-linecap: round;
    }
</style>