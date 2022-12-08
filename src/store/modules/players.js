const state = () => ({
    players: [],
    currentPlayerId: 1
})

const getters = {    
    playerHand: (state, getters) => {
        if (getters.currentPlayer) {
            return getters.currentPlayer.hand
        }
        return []
    },
    currentPlayer: (state) => {
        if (state.players.filter(x => x.id === state.currentPlayerId).length > 0){
            return state.players.filter(x => x.id === state.currentPlayerId)[0]
        }
        return null;
    }
}

const actions = {
    selectTile({ commit, state, getters }, payload) {
        let currentPlayer = getters.currentPlayer
        payload = {...payload, id: state.currentPlayerId, tile: currentPlayer.hand[payload.index]}
        commit('selectTile', payload)
    },
    createNewPlayer({commit, state, dispatch}, payload) {
        commit('bag/shuffleBag', null, { root: true })
        dispatch('bag/drawTiles', {numberOfTiles: 6}, { root: true })
            .then(hand => {
                var newPlayer = {
                    id: state.players.length + 1,
                    hand: hand,
                    // TODO Leaders
                    selectedTile: null,
                    score: {
                        red: 0,
                        green: 0,
                        blue: 0,
                        black: 0,
                        wild: 0
                    },
                    isHuman: payload.isHuman
                }
                commit('createNewPlayer', newPlayer)
            })
    }
}

const mutations = {
    createNewPlayer (state, payload) {
        state.players.push(payload)
    },
    setNextPlayer (state) {
        state.currentPlayerId++
        if (state.currentPlayerId > state.players.length){
            state.currentPlayerId = 1
        }
    },
    selectTile (state, payload) {
        state.players.filter(x => x.id == payload.id)[0].selectedTile = {
            index: payload.index, tile: payload.tile
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}