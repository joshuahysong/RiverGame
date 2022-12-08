import { tileTypes } from '../../common/constants'

const state = () => ({
    bag: [],
    temples: 47,
    markets: 30,
    settlements: 30,
    farms: 36
})

const actions = {
    drawTiles ({state, commit}, payload) {
        commit('shuffleBag')
        let drawnTiles = state.bag.slice(0, payload.numberOfTiles);
        commit('removeTiles', {...payload, drawnTiles})
        return drawnTiles
    }
}

const mutations = {
    shuffleBag(state) {
        let unshuffled = [...state.bag];
        if (state.bag.length == 0){
            state.bag.splice(0)    
            unshuffled = [...unshuffled, ...Array(state.temples).fill(tileTypes.temple, 0)]
            unshuffled = [...unshuffled, ...Array(state.markets).fill(tileTypes.market, 0)]
            unshuffled = [...unshuffled, ...Array(state.settlements).fill(tileTypes.settlement, 0)]
            unshuffled = [...unshuffled, ...Array(state.farms).fill(tileTypes.farm, 0)]
        }

        let shuffled = unshuffled
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        state.bag = [...shuffled]
    },
    removeTiles(state, payload) {
        state.bag.splice(0, payload.numberOfTiles)
        payload.drawnTiles.forEach(tile => {
            if (tile === tileTypes.temple)
                state.temples--;
            if (tile === tileTypes.market)
                state.markets--;
            if (tile === tileTypes.settlement)
                state.settlements--;
            if (tile === tileTypes.farm)
                state.farms--;
        });
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}