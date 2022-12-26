import { tileTypes } from '../../common/constants'

const state = () => ({
    bag: [],
    temples: 0,
    markets: 0,
    settlements: 0,
    farms: 0
})

const defaultState = {
    bag: [],
    temples: 47,
    markets: 30,
    settlements: 30,
    farms: 36
}

const getters = {
    all(state) {
        return state
    },
    debugBagStats(state) {
        return {
            bagCount: state.bag.length,
            temples: state.temples,
            markets: state.markets,
            settlements: state.settlements,
            farms: state.farms
        }
    },
    bagSpaceRemaining(state) {
        return Math.round(state.bag.length /
            (defaultState.temples +
            defaultState.markets +
            defaultState.settlements +
            defaultState.farms) * 100)
    }
}

const actions = {
    init({commit}) {
        commit('setState', defaultState)
        commit('fillBag')
        commit('shuffleBag')
    },
    drawTiles ({state, commit}, payload) {
        if (payload) {
            commit('shuffleBag')
            let drawnTiles = state.bag.slice(0, payload.numberOfTiles);
            commit('removeTiles', {...payload, drawnTiles})
            return drawnTiles
        }
    }
}

const mutations = {
    fillBag(state) {
        let unshuffled = [];
        state.bag.splice(0)
        unshuffled = [...unshuffled, ...Array(state.temples).fill(tileTypes.temple, 0)]
        unshuffled = [...unshuffled, ...Array(state.markets).fill(tileTypes.market, 0)]
        unshuffled = [...unshuffled, ...Array(state.settlements).fill(tileTypes.settlement, 0)]
        unshuffled = [...unshuffled, ...Array(state.farms).fill(tileTypes.farm, 0)]
        state.bag = [...unshuffled]
    },
    shuffleBag(state) {
        let unshuffled = [...state.bag];
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
    },
    setState(state, payload) {
        Object.assign(state, payload)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}