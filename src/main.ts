import { createPinia } from 'pinia'
import { createApp, h } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import SideBar from 'primevue/sidebar'
import Button from 'primevue/button'

import 'primevue/resources/themes/vela-orange/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp({
  render: () => h(App)
})
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue)
app.component('Button', Button)
app.component('SideBar', SideBar)

app.mount('#app')