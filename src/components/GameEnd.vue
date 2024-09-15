<template>
    <div class="card overflow-hidden">
        <div v-for="index in confettiInstances" :key="index" :class="'confetti-' + index"></div>
        <div class="card-header bg-transparent border-0 py-2"><strong>Game Over</strong></div>
        <div class="card-body pt-0 pb-2 px-2">
            <div class="row no-gutters align-items-center">
                <div class="col">
                    Player 1 is the winner
                </div>
            </div>
            <div class="row no-gutters align-items-center">
                <div class="col">
                    Scores
                </div>
            </div>
            <div v-for="playerScore in playerScores"
                :key="playerScore.player.id"
                class="row no-gutters align-items-center">
                <div class="col">
                    Scores
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { actionTypes } from '@/common/constants';
import { mapGetters } from 'vuex'

export default {
    name: 'GameEnd',
    data() {
        return {
            playerScores: [],
            confettiInstances: []
        }
    },
    mounted() {
        this.confettiInstances = [...Array(150).keys()]
    },
    computed: {
        ...mapGetters('game', [
            'currentActionType'
        ]),
        ...mapGetters('players', {
            allPlayers: 'all'
        }),
    },
    watch: {
      currentActionType(newActionType) {
        if (newActionType === actionTypes.gameOver) {
            for (const player of this.allPlayers) {
                let treasureScore = player.score.treasureScore
                let scored = [
                    player.score.temple,
                    player.score.farm,
                    player.score.settlement,
                    player.score.market
                ]
                let minimumScore = Math.min(scored)
                this.playerScores = {
                    player: { ...player },
                    finalScore: minimumScore + treasureScore
                }
            }
            this.playerScores.sort((a, b) => a.minimumScore - b.minimumScore)
        }
      }
    }
}
</script>

<style lang="scss" scoped>
[class|="confetti"] {
  position: absolute;
}

$colors: (#d13447, #ffbf00, #263672);

@for $i from 0 through 150 {
  $w: random(8);
  $l: random(100);
  .confetti-#{$i} {
    width: #{$w}px;
    height: #{$w*0.4}px;
    background-color: nth($colors, random(3));
    top: -10%;
    left: unquote($l+"%");
    opacity: random() + 0.5;
    transform: rotate(#{random()*360}deg);
    animation: drop-#{$i} unquote(1+random()+"s") unquote(random()+"s") infinite;
  }

  @keyframes drop-#{$i} {
    100% {
      top: 110%;
      left: unquote($l+random(5)+"%");
    }
  }
}
</style>