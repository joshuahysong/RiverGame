import { defineStore } from 'pinia'
import { ref } from 'vue'
import { messageTypes } from '@/common/constants'

interface LogMessage {
  timestamp: string
  messageType: number
  text: string
  playerId?: number
}

export const useLogStore = defineStore('log', () => {
  // State
  const messages = ref<LogMessage[]>([])

  // Getters
  const getMessages = () => messages.value

  // Actions
  function init() {
    messages.value = []
  }

  function logActionMessage(messageInfo: { text: string; playerId?: number }) {
    messages.value.unshift({
      timestamp: new Date().toLocaleString('en-US'),
      messageType: messageTypes.action,
      text: messageInfo.text,
      playerId: messageInfo.playerId,
    })
  }

  function logSystemMessage(messageText: string) {
    messages.value.unshift({
      timestamp: new Date().toLocaleString('en-US'),
      messageType: messageTypes.system,
      text: messageText,
    })
  }

  function setMessages(newMessages: LogMessage[]) {
    messages.value = newMessages
  }

  return {
    messages,
    getMessages,
    init,
    logActionMessage,
    logSystemMessage,
    setMessages,
  }
})
