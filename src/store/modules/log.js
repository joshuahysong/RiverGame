import Vue from 'vue';
import { messageTypes } from '../../common/constants'

const state = () => ({
    messages: []
})

const getters = {
    messages(state) {
        return state.messages
    }
}

const mutations = {
    init(state) {
        Vue.set(state, 'messages', [])
    },
    logActionMessage(state, messageInfo) {
        state.messages.unshift({
            timestamp: new Date().toLocaleString("en-US"),
            messageType: messageTypes.action,
            text: messageInfo.text,
            playerId: messageInfo.playerId
        })
    },
    logSystemMessage(state, messageText) {
        state.messages.unshift({
            timestamp: new Date().toLocaleString("en-US"),
            messageType: messageTypes.system,
            text: messageText
        })
    },
    setMessages(state, messages) {
        Vue.set(state, 'messages', messages)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}