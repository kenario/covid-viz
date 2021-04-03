<template>
  <div class="covid-vis-chart-container">
    <Chart
      :labels="getCovidChartLabels"
      :type="getSelectedGraphType.value"
      :data="getCovidChartData"
    />
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { mapGetters } from 'vuex'
import Chart from '@/shared/components/Chart.vue'

export default Vue.extend({
  name: 'CovidChart',

  components: {
    Chart
  },

  computed: {
    ...mapGetters([
      'getSelectedGraphType',
      'getCovidChartLabels',
      'getCovidChartData'
    ])
  }

})
</script>
