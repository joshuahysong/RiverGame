import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Custom icon wrapper components for dynamic icons
import BIcon from './components/stubs/BIcon.vue'
import BIconstack from './components/stubs/BIconstack.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

app.use(createPinia())

// Register custom icon components globally
// These handle dynamic icon names that can't be auto-imported by unplugin-icons
app.component('BIcon', BIcon)
app.component('BIconstack', BIconstack)

app.mount('#app')
