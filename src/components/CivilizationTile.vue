<template>
    <div class="tile" :class="tileClass" :style="tileStyle">
        <div v-if="hasTreasure" class="treasure-icon" :style="treasureStyle"></div>
    </div>
</template>

<script>
import { tileTypes, breakpoints } from '../common/constants'
import helpers from '../common/helpers'

export default {
    name: 'CivilizationTile',
    props: {
        tileType: Number,
        selected: Boolean,
        highlight: Boolean,
        disabled: Boolean,
        hasTreasure: Boolean,
        showPointer: Boolean,
        size: Number
    },
    data() {
        return {
            calculatedSize: 0
        }
    },
    mounted() {
        window.addEventListener("resize", this.onWindowResize);
        this.onWindowResize()
    },
    unmounted() {
        window.removeEventListener("resize", this.onWindowResize);
    },
    computed: {
        tileClass() {
            let cssClass = helpers.getTileNameByType(this.tileType)
            cssClass += this.selected ? ' selected' : ''
            cssClass += this.highlight ? ' highlight' : ''
            cssClass += this.showPointer || this.highlight ? ' pointer' : ''
            cssClass += this.disabled ? ' disabled' : ''
            return cssClass
        },
        tileStyle() {
            let style = ''
            let size = this.size ? this.size : this.calculatedSize
            if (this.size) style += `height: ${size}px; width: ${size}px;`
            if (this.tileType === tileTypes.catastrophe) {
                style += `background: repeating-linear-gradient(`
                style += `135deg,`
                style += `#eed202,`
                style += `#eed202 ${size/4}px,`
                style += `black ${size/4}px,`
                style += `black ${size/2}px);`
            }
            return style
        },
        treasureStyle() {
            let style = 'top: 32.5%; left: 32.5%;'
            if (this.tileType === tileTypes.monumentBottomLeft)
                style = 'top: 40%; left: 20%;'
            if (this.tileType === tileTypes.monumentBottomRight)
                style = 'top: 40%; left: 40%;'
            if (this.tileType === tileTypes.monumentTopLeft)
                style = 'top: 20%; left: 20%;'
            if (this.tileType === tileTypes.monumentTopRight)
                style = 'top: 20%; left: 40%;'

            return style;
        }
    },
    methods: {
        onWindowResize() {
            var windowWidth = window.innerWidth;
            this.calculatedSize = 50
            if (windowWidth <= breakpoints.large) this.calculatedSize = 40
            if (windowWidth <= breakpoints.medium) this.calculatedSize = 30
            if (windowWidth <= breakpoints.small) this.calculatedSize = 20
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
        box-shadow: 0px 0px 0 4px red;
    }

    .highlight {
        box-shadow: 0 0 4px 4px yellow;
    }

    .temple {
        background: $color-temple;
    }

    .market {
        background: $color-market;
    }

    .settlement {
        background: $color-settlement;
    }

    .farm {
        background: $color-farm;
    }

    .generic {
        background: $color-generic;
    }

    .treasure-icon {
        height: 35%;
        width: 35%;
        background-color: gold;
        border-radius: 50%;
        position: absolute;
    }

    .monument-top-left {
        background-color: $color-generic;
    }

    .monument-top-right {
        background-color: $color-generic;
    }

    .monument-bottom-left {
        background-color: $color-generic;
    }

    .monument-bottom-right {
        background-color: $color-generic;
    }
</style>