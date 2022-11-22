<template>
    <div :class="getTileClass()"></div>
</template>

<script>
export default {
    name: 'CivilizationTile',
    props: {
        tile: Number
    },
    methods: {
        getTileClass() {
            switch(this.tile){
                case 1:
                case 2:
                    return 'temple'
                case 3:
                    return 'market'
                case 4:
                    return 'settlement'
                case 5:
                    return 'farm'
                case 6:
                    return 'catastrophe'
            }
        },

    }
}
</script>

<style scoped>
    .temple {
        background: darkred
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
    
    .treasure {
        height: 25px;
        width: 25px;
        background-color: #bbb;
        border-radius: 50%;
        display: inline-block;
    }
</style>