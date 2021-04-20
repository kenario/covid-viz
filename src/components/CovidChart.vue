<template>
  <div class="covid-vis-chart-container">
    <div
      v-if="getCovidChartData.length > 0"
      class="covid-vis-chart"
    >
      <Chart
        :labels="getCovidChartLabels"
        :type="getSelectedGraphType.value"
        :data="getCovidChartData"
      />
    </div>

    <div
      v-else
      class="covid-vis-chart-notification notification-font"
    >
      <slot>
        {{ defaultNotification }}
      </slot>
    </div>
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

  data: () => ({
    defaultNotification: 'Data unavailable'
  }),

  computed: {
    ...mapGetters([
      'getSelectedGraphType',
      'getCovidChartLabels',
      'getCovidChartData'
    ])
  }
})
</script>

<style lang="scss" scoped>

.covid-vis-chart-container {
  display: grid;
}
.covid-vis-chart-notification {
  margin: auto;
}

</style>
