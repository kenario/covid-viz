<template>
  <div class="covid-vis-controls-container">
    <dropdown
      :label="'Country'"
      :hasSearch="true"
      :selectedItem="getSelectedCountry"
    >
      <template v-slot="{ searchText, toggleDropdown }">
        <single-select
          :searchText="searchText"
          :items="getAllAffectedCountries"
          :toggleDropdown="toggleDropdown"
          @selectedItem="setSelectedCountry"
        />
      </template>
    </dropdown>

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
import SingleSelect from '../shared/components/selects/SingleSelect.vue'
import DatePicker from '../shared/components/DatePicker.vue'
import Dropdown from '../shared/components/Dropdown.vue'

export default Vue.extend({
  name: 'CovidVisControls',

  components: {
    Dropdown,
    DatePicker,
    SingleSelect
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
