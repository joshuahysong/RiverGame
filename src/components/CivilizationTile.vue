<template>
    <div class="tile" :class="tileClass" :style="tileStyle">
        <div v-if="hasTreasure" class="treasure-icon"></div>
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

    .temple, .treasure {
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
        border: 2px solid $color-treasure;
        top: 32.5%;
        left: 32.5%;
        position: absolute;
    }

    .monument-top-left {
        background-color: $color-monument-background;
        box-shadow: 3px 3px 0px 3px $color-monument-border inset;
    }

    .monument-top-right {
        background-color: $color-monument-background;
        box-shadow: -3px 3px 0px 3px $color-monument-border inset;
    }

    .monument-bottom-left {
        background-color: $color-monument-background;
        box-shadow: 3px -3px 0px 3px $color-monument-border inset;
    }

    .monument-bottom-right {
        background-color: $color-monument-background;
        box-shadow: -3px -3px 0px 3px $color-monument-border inset;
    }
</style>