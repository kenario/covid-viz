<template>
  <v-app>
    <div>
      <Header />
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
  }
})
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'Big Shoulders Display';
  src: local('Big Shoulders Display'), url('./assets/fonts/BigShouldersDisplay/BigShouldersDisplay-Regular.ttf');
}
</style>
