//import Vue from 'vue'

const state = () => ({
    players: [],
    currentPlayer: 1
})

const getters = {    
    playerHand: (state, getters) => {
        if (getters.currentPlayer) {
            return getters.currentPlayer.hand
        }
        return []
    },
    currentPlayer: (state) => {
        if (state.players.filter(x => x.id === state.currentPlayer).length > 0){
            return state.players.filter(x => x.id === state.currentPlayer)[0]
        }
        return null;
    }
}

const mutations = {
    createNewPlayer (state, payload) {
        var newPlayer = {
            id: state.players.length + 1,
            hand: [2,2,3,4,5,6], // TODO Populate initial hand 
            // TODO Leaders
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
        state.currentPlayer++
        if (state.currentPlayer > state.players.length){
            state.currentPlayer = 1
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}