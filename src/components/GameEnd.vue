<template>
    <div class="card overflow-hidden">
        <div v-for="index in confettiInstances" :key="index" :class="'confetti-' + index"></div>
        <div class="card-header bg-transparent border-0 py-2"><strong>Game Over</strong></div>
        <div class="card-body pt-0 pb-2 px-2">
            <div class="row no-gutters align-items-center pb-2">
                <div class="col">
                    {{ getWinnerName(winningPlayerId) }} is the Winner!
                </div>
            </div>
            <div v-for="(playerScore, index) in playerScores"
                :key="index"
                class="row no-gutters align-items-center justify-content-center small">
                <div class="col-auto">
                    #{{ index + 1 }}: {{ playerScore.player.name }} ({{ playerScore.score[0] }} points)
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { usePlayersStore } from '@/stores/usePlayersStore'
import { useLogStore } from '@/stores/useLogStore'
import type { Player } from '@/stores/usePlayersStore'

interface PlayerScore {
  player: Player
  score: number[]
}

// Get stores
const gameStore = useGameStore()
const playersStore = usePlayersStore()
const logStore = useLogStore()

// Reactive state
const confettiInstances = ref<number[]>([])
const playerScores = ref<PlayerScore[]>([])
const winningPlayerId = ref<number>(0)

// Computed properties from stores
const currentActionType = computed(() => gameStore.currentActionType)
const allPlayers = computed(() => playersStore.all)

// Methods
function getWinnerName(playerId: number): string {
  const player = playersStore.getPlayer(playerId)
  return player ? player.name : ''
}

function getScores(): PlayerScore[] {
  const scores: PlayerScore[] = []
  
  for (const player of allPlayers.value) {
    const treasureScore = player.score.treasure
    let scored = [
      player.score.temple,
      player.score.farm,
      player.score.settlement,
      player.score.market
    ]
    
    for (let i = 0; i < treasureScore; i++) {
      const minimumScore = Math.min(...scored)
      const index = scored.indexOf(minimumScore)
      scored.splice(index, 1)
      scored.push(minimumScore + 1)
    }
    
    scored.sort((a, b) => a - b)
    scores.push({
      player: { ...player },
      score: [...scored]
    })
  }
  
  // Sort taking into account tie breaker
  scores.sort((a, b) => {
    const firstScore = b.score[0] - a.score[0]
    if (firstScore) return firstScore
    const secondScore = b.score[1] - a.score[1]
    if (secondScore) return secondScore
    const thirdScore = b.score[2] - a.score[2]
    if (thirdScore) return thirdScore
    const fourthScore = b.score[3] - a.score[3]
    if (fourthScore) return fourthScore
    return 0
  })
  
  return scores
}

// Lifecycle hooks
onMounted(() => {
  confettiInstances.value = [...Array(150).keys()]
  playerScores.value = getScores()
  winningPlayerId.value = playerScores.value[0].player.id
  
  logStore.logActionMessage({
    playerId: winningPlayerId.value,
    text: 'wins the game with 0 points'
  })
})
</script>

<style lang="scss" scoped>
[class|="confetti"] {
    position: absolute;
}

$colors: (tomato, orange, yellow, dodgerblue, green, purple);

@for $i from 0 through 150 {
    $w: random(8);
    $l: random(100);
    .confetti-#{$i} {
        width: #{$w}px;
        height: #{$w*0.4}px;
        background-color: nth($colors, random(6));
        top: -50%;
        left: unquote($l+"%");
        opacity: random() + 0.5;
        transform: rotate(#{random()*360}deg);
        animation: drop-#{$i} unquote(4+random()+"s") unquote(-20+random()+"s") infinite;
    }

    @keyframes drop-#{$i} {
        100% {
            top: 150%;
            left: unquote($l+random(5)+"%");
        }
    }
}
</style>