<template>
  <div id="covid-vis">
    <Header />
    <CovidGeneralInfo />
    <CovidVisControls />
    <CovidChart />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from './Header.vue'
import CovidGeneralInfo from './CovidGeneralInfo.vue'
import CovidVisControls from './CovidVisControls.vue'
import CovidChart from './CovidChart.vue'

export default Vue.extend({
  name: 'CovidVis',

  components: {
    Header,
    CovidGeneralInfo,
    CovidVisControls,
    CovidChart
  },

  created() {
    this.$store.dispatch('getCovidDataAllCountries')
    this.$store.dispatch('getHistoricalCountryData', { country: 'USA' }) // extract HistoricalDataParasm type
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
