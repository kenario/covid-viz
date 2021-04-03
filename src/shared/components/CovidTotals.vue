<template>
  <div class="covid-totals-container">
    <div class="covid-totals-title section-subtitle-font">
      {{ title }}
    </div>

    <div
      class="covid-totals"
      v-for="(label, l) in infoLabels"
      :key="l"
    >
      <div class="covid-totals-section">
        <div class="covid-totals-label label-font">
          {{ label | turnFirstLetterUppercase }}
        </div>

        <div class="covid-totals-value standard-font">
          <template v-if="label === 'updated'">
            {{ covidTotals[label].toString().length > 10
                  ? moment(covidTotals[label]).format('MMM D ,YYYY, h:mm:ss a')
                  : covidTotals[label].toString()
            }}
          </template>

          <template v-else>
            {{ covidTotals[label] ? covidTotals[label].toLocaleString('en-US') : 'Unavailable' }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { CovidTotals } from '@/types/covid'

export default Vue.extend({

  name: 'CovidTotals',

  props: {
    title: String,
    covidTotals: {} as () => CovidTotals
  },

  data: () => ({
    infoLabels: [] as string[]
  }),

  created() {
    this.infoLabels = Object.keys(this.covidTotals)
  },

  filters: {
    turnFirstLetterUppercase: (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)
  },

  methods: {
    moment: (time: number) => moment(time)
  }
})
</script>

<style lang="scss" scoped>

@import '../../styles/main';

.covid-totals-container {
  height: 100%;
  width: 300px;
  margin: 10px 0 10px 0;
}
.covid-totals-title {
  height: 30px;
  display: grid;
  align-content: center;
  border-radius: 8px;
}
.covid-totals-section {
  margin: 10px 0 10px 10px;
}
</style>
