import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import VCalendar from 'v-calendar'

/*
 * Module does not have an @types on npm, bypassing so I won't have to create a .d.ts file.
 */
// eslint-disable-next-line
const vClickOutside = require('v-click-outside')

Vue.use(VCalendar)
Vue.use(vClickOutside)
Vue.directive(vClickOutside)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
