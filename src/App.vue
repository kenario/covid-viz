<template>
  <div id="app">
    <CovidVis />
  </div>
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

<style lang="scss">
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
