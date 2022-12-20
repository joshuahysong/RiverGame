<template>
    <div class="d-flex justify-content-center align-content-center">
        <b-icon class="tile" :icon="icon" :class="tileClass" :style="style" />
    </div>
</template>

<script>
import helpers from '../common/helpers'

export default {
    name: 'LeaderTile',
    props: {
        tileType: Number,
        size: Number,
        playerId: Number,
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
        style() {
            return `height: ${this.size}px; width: ${this.size}px`
        },
        icon() {
            return `suit-${helpers.getPlayerIconNameById(this.playerId)}-fill`
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