<template>
    <div class="tile" :class="{'selected': selected}">
        <b-icon class="h-100 w-100" :icon="icon" :class="tileClass" />
    </div>
</template>

<script>
import helpers from '../common/helpers'

export default {
    name: 'LeaderTile',
    props: {
        tileType: Number,
        playerId: Number,
        selected: Boolean
    },
    computed: {
        tileClass() {
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