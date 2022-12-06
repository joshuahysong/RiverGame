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
    }
}

const mutations = {
    createNewPlayer (state, payload) {
        var newPlayer = {
            id: state.players.length + 1,
            hand: [2,2,3,4,5,6], // TODO Populate initial hand 
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
        state.players.push(newPlayer)
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