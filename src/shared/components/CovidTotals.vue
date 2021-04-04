<template>
  <div class="covid-totals-container">
    <div class="covid-totals-title section-subtitle-font">
      {{ title }}
    </div>

    <div
      v-if="isTotalsPopulated"
      class="covid-totals-list"
    >
      <div
        class="covid-total"
        v-for="(label, l) in infoLabels"
        :key="l"
      >
        <div class="covid-total-item">
          <div class="covid-totals-label label-font">
            {{ label | turnFirstLetterUppercase }}
          </div>

          <div class="covid-totals-value standard-font">
            {{ totals[label] ? totals[label].toLocaleString('en-US') : 'Unavailable' }}
          </div>
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
    totals: {} as () => CovidTotals
  },

  data: () => ({
    infoLabels: [] as string[]
  }),

  created() {
    this.infoLabels = Object.keys(this.totals)
  },

  computed: {
    isTotalsPopulated: function(): boolean {
      return Object.keys(this.totals).length > 0
    }
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
.covid-total-item {
  margin: 10px 0 10px 10px;
}
</style>
