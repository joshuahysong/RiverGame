import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Stub components for missing BootstrapVue-next components
import BIcon from './components/stubs/BIcon.vue'
import BIconstack from './components/stubs/BIconstack.vue'
import BSidebar from './components/stubs/BSidebar.vue'
import BIconGearFill from './components/stubs/BIconGearFill.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

app.use(createPinia())

// Register stub components globally
app.component('BIcon', BIcon)
app.component('BIconstack', BIconstack)
app.component('BSidebar', BSidebar)
app.component('BIconGearFill', BIconGearFill)

app.mount('#app')
