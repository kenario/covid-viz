<template>
  <v-app>
    <v-main>
      <CovidVis/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import CovidVis from './components/CovidVis.vue'

export default Vue.extend({
  name: 'App',

  components: {
    CovidVis
  }
})
</script>
