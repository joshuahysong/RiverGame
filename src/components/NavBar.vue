<template>
    <div>
        <b-navbar toggleable="sm" type="dark" variant="dark" sticky>
            <b-button size="sm" @click="$emit('new-game')">New Game</b-button>
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <template #button-content>
                        <b-icon-gear-fill />
                    </template>
                    <b-dropdown-form form-class="px-3" style="width: 200px">
                        <b-form-checkbox v-model="showCoordinates" class="small" @change="saveSettings">
                            Show Coordinates
                        </b-form-checkbox>
                        <b-form-checkbox v-if="debug" v-model="showIndexes" class="small" @change="saveSettings">
                            Show Indexes
                        </b-form-checkbox>
                        <b-form-checkbox v-model="showKingdoms" class="small" @change="saveSettings">
                            Show Kingdoms
                        </b-form-checkbox>
                        <b-form-checkbox v-model="showLogTimestamps" class="small" @change="saveSettings">
                            Show Log Timestamps
                        </b-form-checkbox>
                        <b-form-checkbox v-model="showLeaderStrength" class="small" @change="saveSettings">
                            Show Leader Strength
                        </b-form-checkbox>
                    </b-dropdown-form>
                </b-nav-item-dropdown>
                <b-button v-if="debug" size="sm" class="my-2 my-sm-0 mx-2" v-b-toggle.debug-sidebar>Debug</b-button>
            </b-navbar-nav>
        </b-navbar>
        <b-sidebar
            id="debug-sidebar"
            right shadow no-header
            sidebar-class="border-left border-dark text-left mt-5">
            <div class="px-3 py-2">
                Number of Players: {{ numberOfPlayers }}<br />
                Current Action Type: {{ actionTypeName }}<br />
                Current Turn PlayerId: {{ turnPlayerId }}<br />
                Current Visible PlayerId: {{ visiblePlayerId }}<br />
                Current Action PlayerId: {{ actionPlayerId }}<br />
                Bag: {{ debugBagStats }}<br />
            </div>
        </b-sidebar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helpers from '../common/helpers'

export default {
    name: 'NavBar',
    computed: {
        ...mapGetters('bag', [
            'debugBagStats'
        ]),
        ...mapGetters('game', [
            'debug',
            'isSaveValid',
            'numberOfPlayers',
            'turnPlayerId',
            'visiblePlayerId',
            'currentActionType',
            'actionPlayerId',
            'conflictType'
        ]),
        showCoordinates: {
            get () {
                return this.$store.getters['settings/showCoordinates']
            },
            set (value) {
                this.$store.commit('settings/setShowCoordinates', value)
            }
        },
        showIndexes: {
            get () {
                return this.$store.getters['settings/showIndexes']
            },
            set (value) {
                this.$store.commit('settings/setShowIndexes', value)
            }
        },
        showKingdoms: {
            get () {
                return this.$store.getters['settings/showKingdoms']
            },
            set (value) {
                this.$store.commit('settings/setShowKingdoms', value)
            }
        },
        showLogTimestamps: {
            get () {
                return this.$store.getters['settings/showLogTimestamps']
            },
            set (value) {
                this.$store.commit('settings/setShowLogTimestamps', value)
            }
        },
        showLeaderStrength: {
            get () {
                return this.$store.getters['settings/showLeaderStrength']
            },
            set (value) {
                this.$store.commit('settings/setShowLeaderStrength', value)
            }
        },
        actionTypeName() {
            return helpers.getActionNameByType(this.currentActionType)
        },
    },
    methods: {
        onNewGameClicked() {
            this.$emit('new-game')
        },
        saveSettings() {
            this.$store.dispatch('settings/save')
        }
    }
}
</script>