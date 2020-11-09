<template>
  <div class="covid-vis-controls-container">
    <!-- Country dropdown -->
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

    <!-- Date picker -->
    <date-picker
      :label="'Dates'"
      @selectDate="setSelectedDateRange"
    />

    <!-- Data type dropdown -->
    <dropdown
      :label="'Data Type'"
      :selectedItem="dataTypesSelected"
    >
      <template>
        <multi-select
          :items="dataTypes"
          :allItemsCheckedOnMount="true"
          @checkedItems="setSelectedDataType"
        ></multi-select>
      </template>
    </dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { DateRange } from '../types/DateRange'
import Dropdown from '../shared/components/Dropdown.vue'
import DatePicker from '../shared/components/DatePicker.vue'
import MultiSelect from '../shared/components/selects/MultiSelect.vue'
import SingleSelect from '../shared/components/selects/SingleSelect.vue'

export default Vue.extend({
  name: 'CovidVisControls',

  components: {
    Dropdown,
    DatePicker,
    MultiSelect,
    SingleSelect
  },

  computed: {
    ...mapGetters([
      'getSelectedCountry',
      'getAllAffectedCountries'
    ])
  },

  data: () => ({
    dataTypes: ['cases', 'deaths', 'recovered'],
    dataTypesSelected: ''
  }),

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
    },

    setSelectedDataType: function(dataType: string[]): void {
      this.dataTypesSelected = dataType.join(', ')
      this.$store.commit('setSelectedCovidDataType', dataType)
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
