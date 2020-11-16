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
    <!-- Date picker dropdown -->
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
        />
      </template>
    </dropdown>
    <!-- Result type dropdown -->
    <dropdown
      :label="'Results Type'"
      :selectedItem="getSelectedResultType"
    >
      <template v-slot="{ toggleDropdown }">
        <single-select
          :items="resultTypes"
          :toggleDropdown="toggleDropdown"
          @selectedItem="setSelectedResultType"
        />
      </template>
    </dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { DateRange, ResultType } from '../types/'
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
      'getSelectedResultType',
      'getAllAffectedCountries'
    ])
  },

  data: () => ({
    resultTypes: [
      'total',
      'totalPerDay'
    ],
    dataTypes: [
      'cases',
      'deaths',
      'recovered'
    ],
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
    },

    setSelectedResultType: function(resultType: ResultType): void {
      this.$store.commit('setSelectedResultType', resultType)
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
