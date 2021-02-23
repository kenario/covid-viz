<template>
  <div class="covid-general-info-container">
    <div class="covid-general-info-title">
      {{ title }}
    </div>

    <div
      class="covid-general-info"
      v-for="(label, l) in infoLabels"
      :key="l"
    >
      <div class="covid-general-info-section">
        <div class="covid-general-info-label">
          {{ label | turnFirstLetterUppercase }}
        </div>

        <div class="covid-general-info-value">
          <template v-if="label === 'updated'">
            {{ covidGeneralInfo[label].toString().length > 10
                  ? moment(covidGeneralInfo[label]).format('MMMM Do YYYY, h:mm:ss a')
                  : covidGeneralInfo[label].toString()
            }}
          </template>

          <template v-else>
            {{ covidGeneralInfo[label] ? covidGeneralInfo[label].toLocaleString('en-US') : 'Unavailable' }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { CovidGeneralInfo } from '../../types'

export default Vue.extend({

  name: 'CovidGeneralInfo',

  props: {
    title: String,
    covidGeneralInfo: {} as () => CovidGeneralInfo
  },

  data: () => ({
    infoLabels: [] as string[]
  }),

  created() {
    this.infoLabels = Object.keys(this.covidGeneralInfo)
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

.covid-general-info-container {
  height: 100%;
  width: 300px;
  margin: 10px 0 10px 0;
}
.covid-general-info-title {
  color: $primary-color;
  font-size: 1.75rem;
  font-weight: 500;
  height: 30px;
  display: grid;
  align-content: center;
  border-radius: 8px;
}
.covid-general-info-section {
  margin: 10px 0 10px 20px;
}
.covid-general-info-label {
  color: $accent-color;
  font-weight: 600;
  font-size: 1.25rem;
}
.covid-general-info-value {
  color: $primary-color;
  font-weight: 600;
}
</style>
