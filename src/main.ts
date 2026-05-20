import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const app = createApp(App)

app.use(createPinia())
// @ts-expect-error - BootstrapVue v2 types are not fully compatible with Vue 3
app.use(BootstrapVue)
// @ts-expect-error - BootstrapVue v2 types are not fully compatible with Vue 3
app.use(IconsPlugin)

app.mount('#app')
