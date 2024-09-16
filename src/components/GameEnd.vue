<template>
    <div class="card overflow-hidden">
        <div v-for="index in confettiInstances" :key="index" :class="'confetti-' + index"></div>
        <div class="card-header bg-transparent border-0 py-2"><strong>Game Over</strong></div>
        <div class="card-body pt-0 pb-2 px-2">
            <div class="row no-gutters align-items-center pb-2">
                <div class="col">
                    {{ getScores()[0].player.name }} is the Winner!
                </div>
            </div>
            <div v-for="(playerScore, index) in getScores()"
                :key="index"
                class="row no-gutters align-items-center justify-content-center small">
                <div class="col-auto">
                    #{{ index + 1 }}: {{ playerScore.player.name }} ({{ playerScore.finalScore }} points)
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'GameEnd',
    data() {
        return {
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
    methods: {
      getScores() {
        let playerScores = []
        for (const player of this.allPlayers) {
            let treasureScore = player.score.treasure
            let scored = [
                player.score.temple,
                player.score.farm,
                player.score.settlement,
                player.score.market
            ]
            for (let i = 0; i < treasureScore; i++) {
                let minimumScore = Math.min(...scored)
                let index = scored.indexOf(minimumScore)
                scored.splice(index, 1)
                scored.push(++minimumScore)
            }
            playerScores.push({
                player: { ...player },
                finalScore: Math.min(...scored)
            })
        }
        playerScores.sort((a, b) => b.finalScore - a.finalScore)
        return playerScores
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