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

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'GameEnd',
    data() {
        return {
            confettiInstances: [],
            playerScores: [],
            winningPlayerId: 0
        }
    },
    mounted() {
        this.confettiInstances = [...Array(150).keys()],
        this.playerScores =  this.getScores()
        this.winningPlayerId = this.playerScores[0].player.id
        this.$store.commit('log/logActionMessage', {
            playerId: this.winningPlayerId,
            text: `wins the game with 0 points`
        })
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
        getWinnerName(playerId) {
            const player = this.$store.getters['players/getPlayer'](playerId)
            return player ? player.name : ''
        },
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
                scored.sort((a,b) => a - b)
                playerScores.push({
                    player: { ...player },
                    score:[...scored]
                })
            }
            // sort taking into account tie breaker
            playerScores.sort((a, b) => {
                let firstScore = b.score[0] - a.score[0]
                if (firstScore) return firstScore
                let secondScore = b.score[1] - a.score[1]
                if (secondScore) return secondScore
                let thirdScore = b.score[2] - a.score[2]
                if (thirdScore) return thirdScore
                let fourthScore = b.score[3] - a.score[3]
                if (fourthScore) return fourthScore
            })
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