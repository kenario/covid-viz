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
        <div
          v-if="totals[label]"
          class="covid-total-item"
        >
          <div class="covid-totals-label label-font">
            {{ label | turnFirstLetterUppercase }}
          </div>

          <div class="covid-totals-value standard-font">
            {{ totals[label].toLocaleString('en-US') }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="covid-totals-notification notification-font"
    >
      <slot>
        {{ defaultNotification }}
      </slot>
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
    defaultNotification: 'Data unavailable'
  }),

  computed: {
    isTotalsPopulated: function(): boolean {
      return Object.keys(this.totals).length > 0
    },
    infoLabels: function(): string[] {
      return Object.keys(this.totals)
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
.covid-totals-notification {
  margin: 10px 0 10px 10px;
}
</style>
