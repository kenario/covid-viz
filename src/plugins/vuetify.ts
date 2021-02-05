import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#184F63',
        secondary: '#CED5AE',
        accent: '#DA7F46'
      }
    }
  }
})
