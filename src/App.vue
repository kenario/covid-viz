<template>
  <div id="app">
    <div
      v-for="(country, index) in getCountries"
      :key="index"
    >
      {{ country }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'App',

  computed: {
    ...mapGetters([
      'getCountries'
    ])
  },

  created(): void {
    this.$store.dispatch('getCovidData')
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
