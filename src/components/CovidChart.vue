<template>
  <div class="covid-vis-chart-container">
    <Chart
      :labels="getCovidChartLabels"
      :data="getCovidChartData"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Chart from './Chart.vue'

export default Vue.extend({
  name: 'CovidChart',

  components: {
    Chart
  },

  computed: {
    ...mapGetters([
      'getCovidGeneralInfo',
      'getCovidChartLabels',
      'getCovidChartData'
    ])
  }

})
</script>

<style lang="scss" scoped>
.covid-vis-chart-container {
  grid-column: 1 / 5;
  grid-row: 5 / 6;
}
</style>
