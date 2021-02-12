<template>
  <v-app>
    <div>
      <transition name="fade-slide-down">
        <Header v-if="renderHeader" />
      </transition>
    </div>

    <v-main>
      <CovidVis/>
    </v-main>
  </v-app>
</template>

<script lang="ts">

import Vue from 'vue'
import CovidVis from './components/CovidVis.vue'
import Header from './components/Header.vue'

export default Vue.extend({
  name: 'App',

  components: {
    CovidVis,
    Header
  },

  data: () => ({
    renderHeader: false
  }),

  created() {
    setTimeout(() => { this.renderHeader = true }, 100)
  }
})
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'Big Shoulders Display';
  src: local('Big Shoulders Display'), url('./assets/fonts/BigShouldersDisplay/BigShouldersDisplay-Regular.ttf');
}
.fade-slide-down-enter-active, .fade-slide-down-leave-active {
  transition: all 1s ease;
}
.fade-slide-down-enter, .fade-slide-down-leave-to {
  transform: translateY(-70px);
  opacity: 0.5;
}
</style>
