<template>
  <div class="covid-vis-general-info-container">
    <div
      class="covid-vis-general-info"
      v-for="(label, index) in infoLabels"
      :key="index"
    >
      <div class="covid-vis-general-info-label">
        {{ label | firstLetterUppercase }}
      </div>

      <div class="covid-vis-general-info-value">
        <template v-if="label === 'updated'">
          {{ moment(getCovidGeneralInfo[label]).format('MMMM Do YYYY, h:mm:ss a') }}
        </template>

        <template v-else>
          {{ getCovidGeneralInfo[label] }}
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'CovidGeneralInfo',

  computed: {
    ...mapGetters([
      'getCovidGeneralInfo'
    ])
  },

  data: () => ({
    infoLabels: [] as string[]
  }),

  created() {
    this.infoLabels = Object.keys(this.getCovidGeneralInfo)
  },

  filters: {
    firstLetterUppercase: (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)
  },

  methods: {
    moment: (time: number) => moment(time)
  }
})
</script>

<style lang="scss" scoped>
.covid-vis-general-info-container {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}
.covid-vis-general-info {
  text-align: left;
  margin: 10px 0px 10px 0px;
}
.covid-vis-general-info-label {
  background-color: black;
  color: white;
  font-size: 11px;
  padding: 5px 0px 5px 3px;
}
.covid-vis-general-info-value {
  padding: 5px 0px 0px 15px;
}
</style>
