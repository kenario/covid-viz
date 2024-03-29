import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import VCalendar from 'v-calendar'
import 'vue-loaders/dist/vue-loaders.css'
import VueLoadersBallBeat from 'vue-loaders/dist/loaders/ball-beat'

/*
 * Module does not have an @types on npm, bypassing so I won't have to create a .d.ts file.
 */
// eslint-disable-next-line
const vClickOutside = require('v-click-outside')

Vue.use(VCalendar)
Vue.use(vClickOutside)
Vue.use(VueLoadersBallBeat)
Vue.directive(vClickOutside)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
