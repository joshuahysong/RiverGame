import { actionTypes } from '../../common/constants'

const state = () => ({
    currentPlayerId: 1,
    numberOfPlayers: 1,
    remainingActions: 2,
    currentActionType: actionTypes.playUnit
})

const getters = {
    currentActionType(state) {
        return state.currentActionType
    },
    currentPlayerId(state) {
        return state.currentPlayerId
    }
}

const mutations = {
    setActivePlayer(state) {
        state.currentPlayerId = state.currentPlayerId >= state.numberOfPlayers
            ? 1 : state.currentPlayerId + 1            
        state.remainingActions = 2
        state.currentAction = actionTypes.playUnit
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}