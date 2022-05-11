import { createApp, h } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'

import 'primevue/resources/themes/vela-orange/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp({
  render: () => h(App)
})

app.use(PrimeVue)

app.mount('#app')