const state = () => ({
    showCoordinates: true,
    showIndexes: false,
    showKingdoms: true,
    showLogTimestamps: true,
    showLeaderStrength: true
})

const getters = {
    all(state) {
        return state
    },
    showCoordinates(state) {
        return state.showCoordinates
    },
    showIndexes(state) {
        return state.showIndexes
    },
    showKingdoms(state) {
        return state.showKingdoms
    },
    showLogTimestamps(state) {
        return state.showLogTimestamps
    },
    showLeaderStrength(state) {
        return state.showLeaderStrength
    }
}

const actions = {
    save({state}) {
        localStorage.gameSettings = JSON.stringify(state);
    },
    load({commit}) {
        if (localStorage.gameSettings) {
            let gameSettings = JSON.parse(localStorage.gameSettings);
            commit('setState', gameSettings)
        }
    }
}

const mutations = {
    setState(state, newState) {
        Object.assign(state, newState)
    },
    setShowCoordinates(state, payload) {
        state.showCoordinates = payload
    },
    setShowIndexes(state, payload) {
        state.showIndexes = payload
    },
    setShowKingdoms(state, payload) {
        state.showKingdoms = payload
    },
    setShowLogTimestamps(state, payload) {
        state.showLogTimestamps = payload
    },
    setShowLeaderStrength(state, payload) {
        state.showLeaderStrength = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}