<template>
  <div id="covid-vis">
    <Header />
    <CovidGeneralInfo />
    <CovidVisControls />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from './Header.vue'
import CovidGeneralInfo from './CovidGeneralInfo.vue'
import CovidVisControls from './CovidVisControls.vue'

export default Vue.extend({
  name: 'CovidVis',

  components: {
    Header,
    CovidGeneralInfo,
    CovidVisControls
  },

  created() {
    this.$store.dispatch('getCovidDataAllCountries')
  }
})
</script>

<style scoped lang="scss">
#covid-vis {
  display: grid;
  grid-template-columns: 10px 1fr 10px 1fr 10px;
  grid-template-rows: 80px 10px 0.4fr 10px 1fr 10px;
  height: 100%;
}
</style>
