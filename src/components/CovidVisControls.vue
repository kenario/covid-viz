<template>
  <div class="covid-vis-controls-container">
    <dropdown-filter
      :label="'Country'"
      :items="getAllAffectedCountries"
      :defaultItem="getSelectedCountry"
      @selectItem="setSelectedCountry"
    />

    <date-picker
      :label="'Dates'"
      @selectDate="setSelectedDateRange"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { DateRange } from '../types/DateRange'
import DatePicker from '../shared/components/DatePicker.vue'
import DropdownFilter from '../shared/components/DropdownFilter.vue'

export default Vue.extend({
  name: 'CovidVisControls',

  components: {
    DropdownFilter,
    DatePicker
  },

  computed: {
    ...mapGetters([
      'getSelectedCountry',
      'getAllAffectedCountries'
    ])
  },

  methods: {
    setSelectedCountry: async function(country: string): Promise<void> {
      this.$store.commit('setSelectedCountry', country)
      this.$store.commit('setSelectedCovidData')
      await this.$store.dispatch('getHistoricalCountryData')
    },

    setSelectedDateRange: async function(dates: Date[]): Promise<void> {
      const dateRange: DateRange = { startDate: dates[0], endDate: dates[1] }
      this.$store.commit('setSelectedDates', dateRange)
      await this.$store.dispatch('getHistoricalCountryData')
    }
  }
})
</script>

<style lang="scss" scoped>
.covid-vis-controls-container {
  grid-column: 4 / 5;
  grid-row: 3 / 4;
}
</style>
