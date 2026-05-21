import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const showCoordinates = ref(true)
  const showIndexes = ref(false)
  const showKingdoms = ref(true)
  const showLogTimestamps = ref(true)
  const showLeaderStrength = ref(true)

  // Getters
  const all = computed(() => ({
    showCoordinates: showCoordinates.value,
    showIndexes: showIndexes.value,
    showKingdoms: showKingdoms.value,
    showLogTimestamps: showLogTimestamps.value,
    showLeaderStrength: showLeaderStrength.value
  }))

  // Actions
  function save() {
    localStorage.gameSettings = JSON.stringify(all.value)
  }

  function load() {
    if (localStorage.gameSettings) {
      const gameSettings = JSON.parse(localStorage.gameSettings)
      setState(gameSettings)
    }
  }

  function setState(newState: Partial<{
    showCoordinates: boolean
    showIndexes: boolean
    showKingdoms: boolean
    showLogTimestamps: boolean
    showLeaderStrength: boolean
  }>) {
    if (newState.showCoordinates !== undefined) showCoordinates.value = newState.showCoordinates
    if (newState.showIndexes !== undefined) showIndexes.value = newState.showIndexes
    if (newState.showKingdoms !== undefined) showKingdoms.value = newState.showKingdoms
    if (newState.showLogTimestamps !== undefined) showLogTimestamps.value = newState.showLogTimestamps
    if (newState.showLeaderStrength !== undefined) showLeaderStrength.value = newState.showLeaderStrength
  }

  function setShowCoordinates(payload: boolean) {
    showCoordinates.value = payload
  }

  function setShowIndexes(payload: boolean) {
    showIndexes.value = payload
  }

  function setShowKingdoms(payload: boolean) {
    showKingdoms.value = payload
  }

  function setShowLogTimestamps(payload: boolean) {
    showLogTimestamps.value = payload
  }

  function setShowLeaderStrength(payload: boolean) {
    showLeaderStrength.value = payload
  }

  return {
    showCoordinates,
    showIndexes,
    showKingdoms,
    showLogTimestamps,
    showLeaderStrength,
    all,
    save,
    load,
    setState,
    setShowCoordinates,
    setShowIndexes,
    setShowKingdoms,
    setShowLogTimestamps,
    setShowLeaderStrength
  }
})
