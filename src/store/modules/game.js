import { actionTypes } from '../../common/constants'

const state = () => ({
    currentPlayerId: 1,
    numberOfPlayers: 0,
    remainingActions: 2,
    currentActionType: actionTypes.playUnit
})

const getters = {
    currentActionType(state) {
        return state.currentActionType
    },
    currentPlayerId(state) {
        return state.currentPlayerId
    },
    remainingActions(state) {
        return state.remainingActions
    }
}

const mutations = {
    nextActivePlayer(state) {
        state.currentPlayerId = state.currentPlayerId >= state.numberOfPlayers
            ? 1 : state.currentPlayerId + 1            
        state.remainingActions = 2
        state.currentAction = actionTypes.playUnit
    },
    incrementPlayerCount(state) {
        state.numberOfPlayers++
    },
    actionCompleted(state){
        state.remainingActions--
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}