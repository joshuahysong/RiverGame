<template>
  <div
    class="row no-gutters justify-content-center align-items-center bg-light w-100 py-2 border-bottom action-bar"
  >
    <div class="col-12 col-sm-auto m-0 mr-sm-2">
      <b-icon
        :icon="leaderIcon"
        class="mr-2"
      />
      <div
        v-if="showCurrentPlayerMessage"
        class="d-inline-block"
      >
        {{ playerName }}'s Turn: {{ remainingActionsMessage }}
      </div>
      <div
        v-if="showTakeTreasureMessage"
        class="d-inline-block"
      >
        {{ playerName }} {{ treasureMessage }}
      </div>
      <div
        v-if="showBuildMonumentMessage"
        class="d-inline-block"
      >
        {{ playerName }}: Select a monument to build.
      </div>
      <div
        v-if="showBuildMonumentMultipleMessage"
        class="d-inline-block"
      >
        {{ playerName }}: Select the top-left location for the monument.
      </div>
      <div
        v-if="showSwapTilesMessage"
        class="d-inline-block"
      >
        {{ playerName }}: Select tiles to discard and redraw.
      </div>
      <div
        v-if="showWarMessage"
        class="d-inline-block"
      >
        {{ playerName }}: Select<b-icon
          icon="square-fill"
          :class="warTileType"
          class="mx-2"
        />to
        commit for support.
      </div>
      <div
        v-if="showWarChooseLeaderMessage"
        class="d-inline-block"
      >
        {{ playerName }}: Select which leaders must battle first.
      </div>
    </div>
    <div
      v-if="showPlayerActionButtons"
      class="col-12 col-sm-auto pt-1 pt-sm-0"
    >
      <div v-if="showCurrentPlayerMessage">
        <b-button
          variant="primary"
          size="sm"
          :disabled="areActionsDepleted"
          class="mr-2"
          @click="beginSwapTiles"
        >
          Swap Tiles
        </b-button>
        <b-button
          variant="warning"
          size="sm"
          :disabled="!hasSnapshot"
          class="mr-2"
          @click="undoLastAction"
        >
          Undo
        </b-button>
        <b-button
          variant="danger"
          size="sm"
          :hidden="areActionsDepleted"
          class="mr-2"
          @click="showPassTurnMessageBox"
        >
          Pass
        </b-button>
        <b-button
          variant="success"
          size="sm"
          :hidden="!areActionsDepleted"
          @click="doEndTurn"
        >
          End Turn
        </b-button>
      </div>
      <div v-if="showBuildMonumentMessage || showBuildMonumentMultipleMessage">
        <b-button
          variant="warning"
          size="sm"
          @click="passMonumentBuilding"
        >
          Pass
        </b-button>
      </div>
      <div v-if="showSwapTilesMessage && player">
        <b-button
          variant="warning"
          size="sm"
          class="mr-2"
          @click="stopSwapTiles"
        >
          Cancel
        </b-button>
        <b-button
          variant="danger"
          size="sm"
          @click="doSwapTiles"
        >
          Discard {{ player.selectedTiles.length }} Tile{{
            player.selectedTiles.length === 1 ? '' : 's'
          }}
        </b-button>
      </div>
      <div v-if="showWarMessage && player">
        <b-button
          v-if="showRevoltAttackMessage"
          variant="warning"
          size="sm"
          :disabled="!hasSnapshot"
          class="mr-2"
          @click="undoLastAction"
        >
          Undo
        </b-button>
        <b-button
          variant="success"
          size="sm"
          @click="commitTilesToConflict"
        >
          Commit {{ player.selectedTiles.length }} Tiles
        </b-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, h } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useBoardStore } from '@/stores/useBoardStore'
import { usePlayersStore } from '@/stores/usePlayersStore'
import { useLogStore } from '@/stores/useLogStore'
import helpers from '@/common/helpers'
import { actionTypes, conflictTypes } from '@/common/constants'
import type { Player } from '@/stores/usePlayersStore'

// Get stores
const gameStore = useGameStore()
const boardStore = useBoardStore()
const playersStore = usePlayersStore()
const logStore = useLogStore()

// Get instance for $bvModal access
const instance = getCurrentInstance()
const bvModal = (instance?.proxy as any)?.$bvModal

// Computed properties from stores
const remainingActions = computed(() => gameStore.remainingActions)
const turnPlayerId = computed(() => gameStore.turnPlayerId)
const actionPlayerId = computed(() => gameStore.actionPlayerId)
const visiblePlayerId = computed(() => gameStore.visiblePlayerId)
const currentActionType = computed(() => gameStore.currentActionType)
const hasSnapshot = computed(() => gameStore.hasSnapshot)
const conflictDefenderLeader = computed(() => gameStore.conflictDefenderLeader)
const conflictTileType = computed(() => gameStore.conflictTileType)
const conflictType = computed(() => gameStore.conflictType)
const availableMonumentLocations = computed(() => boardStore.availableMonumentLocations)
const treasuresToTake = computed(() => boardStore.treasuresToTake)
const conflictTile = computed(() => boardStore.conflictTile)
const remainingTreasures = computed(() => boardStore.remainingTreasures)

// Component computed properties
const leaderIcon = computed(() => helpers.getPlayerIconNameById(actionPlayerId.value))

const player = computed<Player | null>(() => playersStore.getPlayer(actionPlayerId.value))

const playerName = computed(() => player.value?.name)

const remainingActionsMessage = computed(
  () => `${remainingActions.value} Action${remainingActions.value === 1 ? '' : 's'} Remaining. `
)

const areActionsDepleted = computed(() => remainingActions.value === 0)

const treasureMessage = computed(() =>
  treasuresToTake.value > 1
    ? `must select 1 of ${treasuresToTake.value} Treasures to acquire.`
    : 'must select a Treasure to acquire.'
)

const warTileType = computed(() => helpers.getTileNameByType(conflictTileType.value))

const showPlayerActionButtons = computed(() => visiblePlayerId.value === actionPlayerId.value)

const showCurrentPlayerMessage = computed(() => currentActionType.value === actionTypes.playTile)
const showTakeTreasureMessage = computed(() => currentActionType.value === actionTypes.takeTreasure)
const showBuildMonumentMessage = computed(
  () => currentActionType.value === actionTypes.buildMonument
)
const showBuildMonumentMultipleMessage = computed(
  () => currentActionType.value === actionTypes.buildMonumentMultiple
)
const showSwapTilesMessage = computed(() => currentActionType.value === actionTypes.swapTiles)
const showRevoltAttackMessage = computed(
  () =>
    conflictType.value === conflictTypes.revolt &&
    currentActionType.value === actionTypes.conflictAttack
)
const showRevoltDefendMessage = computed(
  () =>
    conflictType.value === conflictTypes.revolt &&
    currentActionType.value === actionTypes.conflictDefend
)
const showWarAttackMessage = computed(
  () =>
    conflictType.value === conflictTypes.war &&
    currentActionType.value === actionTypes.conflictAttack
)
const showWarDefendMessage = computed(
  () =>
    conflictType.value === conflictTypes.war &&
    currentActionType.value === actionTypes.conflictDefend
)
const showWarChooseLeaderMessage = computed(
  () => currentActionType.value === actionTypes.conflictChooseLeader
)

const showWarMessage = computed(
  () =>
    showRevoltAttackMessage.value ||
    showRevoltDefendMessage.value ||
    showWarAttackMessage.value ||
    showWarDefendMessage.value
)

// Methods
async function doEndTurn() {
  gameStore.clearSnapshot()
  boardStore.resetBoardTileHighlights()
  boardStore.resetAvailableTileLocations()
  boardStore.checkForMonumentScore()

  if (remainingTreasures.value <= 2) {
    logStore.logActionMessage({
      text: `Game has ended due to ${remainingTreasures.value} treasure remaining on the board`,
    })
    gameStore.setActionType(actionTypes.gameOver)
    gameStore.save()
  }

  await playersStore.refillPlayerHands()

  if (currentActionType.value !== actionTypes.gameOver) {
    gameStore.nextActivePlayer()
    gameStore.save()
  }
}

async function showPassTurnMessageBox() {
  if (!bvModal) return

  boardStore.resetAvailableTileLocations()
  boardStore.resetBoardTileHighlights()

  const message = h('div', { class: ['text-center'] }, [
    'Are you sure?',
    h('br'),
    `You have ${remainingActionsMessage.value}`,
  ])

  const result = await bvModal.msgBoxConfirm(message, {
    size: 'sm',
    buttonSize: 'sm',
    okVariant: 'danger',
    okTitle: 'Pass Turn',
    cancelVariant: 'primary',
    footerClass: 'border-top-0',
  })

  if (result && player.value) {
    logStore.logActionMessage({
      playerId: player.value.id,
      text: 'passed their turn',
    })
    await doEndTurn()
  }
}

function passMonumentBuilding() {
  availableMonumentLocations.value.forEach((location: any) => {
    const tile = boardStore.tiles.find((t: any) => t.index === location.index)
    if (tile) boardStore.updateTile({ ...tile, isHighlighted: false })
  })
  gameStore.setActionType(actionTypes.playTile)
  gameStore.actionCompleted()
  boardStore.checkForTreasureToTake()
}

function beginSwapTiles() {
  if (!player.value) return

  boardStore.resetAvailableTileLocations()
  boardStore.resetBoardTileHighlights()
  playersStore.clearTileSelection(player.value.id)
  gameStore.setActionType(actionTypes.swapTiles)
}

function stopSwapTiles() {
  if (!player.value) return

  playersStore.clearTileSelection(player.value.id)
  gameStore.clearSnapshot()
  gameStore.setActionType(actionTypes.playTile)
}

async function doSwapTiles() {
  if (!player.value) return

  await playersStore.swapTiles({ ...player.value })

  if (currentActionType.value !== actionTypes.gameOver) {
    gameStore.setActionType(actionTypes.playTile)
    gameStore.actionCompleted()
  } else {
    gameStore.save()
  }
}

function undoLastAction() {
  gameStore.restoreSnapshot()
  gameStore.clearSnapshot()
  boardStore.resetBoardTileHighlights()
}

function commitTilesToConflict() {
  if (!player.value) return

  if (currentActionType.value === actionTypes.conflictAttack) {
    gameStore.clearSnapshot()
    gameStore.setConflictAttackerTiles(player.value.selectedTiles)
    playersStore.removeTilesFromHand({
      playerId: player.value.id,
      tilesToRemove: [...player.value.selectedTiles],
    })
    playersStore.clearTileSelection(player.value.id)
    if (conflictDefenderLeader.value) {
      gameStore.setActionPlayerId(conflictDefenderLeader.value.playerId)
    }
    gameStore.setActionType(actionTypes.conflictDefend)
  } else if (currentActionType.value === actionTypes.conflictDefend) {
    gameStore.setConflictDefenderTiles(player.value.selectedTiles)
    playersStore.removeTilesFromHand({
      playerId: player.value.id,
      tilesToRemove: [...player.value.selectedTiles],
    })
    playersStore.clearTileSelection(player.value.id)
    gameStore.resolveConflict()
    if (conflictTile.value) {
      boardStore.checkForWar(conflictTile.value)
    }

    if (
      currentActionType.value !== actionTypes.conflictAttack &&
      currentActionType.value !== actionTypes.conflictChooseLeader
    ) {
      gameStore.setActionPlayerId(turnPlayerId.value)
      gameStore.setActionType(actionTypes.playTile)
      gameStore.actionCompleted()
      boardStore.checkForTreasureToTake()
    }
  }
}
</script>

<style lang="scss" scoped>
.action-bar {
  min-height: 50px;
}

.temple {
  color: $color-temple;
}

.market {
  color: $color-market;
}

.settlement {
  color: $color-settlement;
}

.farm {
  color: $color-farm;
}
</style>
