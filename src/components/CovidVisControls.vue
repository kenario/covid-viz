<template>
  <div class="covid-vis-controls-container">
    <!-- Country dropdown -->
    <dropdown
      :label="'Country'"
      :hasSearch="true"
      :selectedItem="getSelectedCountry"
    >
      <template v-slot="{ toggleDropdown }">
        <single-select
          :hasSearchBar="true"
          :items="getAllAffectedCountries.map(countryInfo => { return { name: countryInfo.name, value: countryInfo.name } })"
          @selectedItem="setSelectedCountry($event); toggleDropdown()"
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
          @itemCheck="setSelectedDataType"
        />
      </template>
    </dropdown>
    <!-- Result type dropdown -->
    <dropdown
      :label="'Results Type'"
      :selectedItem="getSelectedResultType.name"
    >
      <template v-slot="{ toggleDropdown }">
        <single-select
          :items="resultTypes"
          @selectedItem="setSelectedResultType($event); toggleDropdown()"
        />
      </template>
    </dropdown>
    <!-- Type of graph dropdown -->
    <dropdown
      :label="'Graph Type'"
      :selectedItem="getSelectedGraphType.name"
    >
      <template v-slot="{ toggleDropdown }">
        <single-select
          :items="graphTypes"
          @selectedItem="setSelectedGraphType($event); toggleDropdown()"
        ></single-select>
      </template>
    </dropdown>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { mapGetters } from 'vuex'
import { DateRange, ResultType, GraphType, SelectItem } from '../types/'
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
      'getSelectedGraphType',
      'getSelectedResultType',
      'getAllAffectedCountries'
    ])
  },

  data: () => ({
    resultTypes: [
      { name: 'Total', value: 'total' },
      { name: 'Total Per Day', value: 'totalPerDay' }
    ],
    dataTypes: [
      { name: 'Cases', value: 'cases' },
      { name: 'Deaths', value: 'deaths' },
      { name: 'Recovered', value: 'recovered' }
    ],
    graphTypes: [
      { name: 'Line', value: 'line' },
      { name: 'Bar', value: 'bar' }
    ],
    dataTypesSelected: ''
  }),

  methods: {
    setSelectedCountry: async function(country: SelectItem): Promise<void> {
      this.$store.commit('setSelectedCountry', country)
      this.$store.commit('setSelectedCovidData')
      await this.$store.dispatch('getHistoricalCountryData')
    },

    setSelectedDateRange: async function(dates: Date[]): Promise<void> {
      const dateRange: DateRange = { startDate: dates[0], endDate: dates[1] }
      this.$store.commit('setSelectedDates', dateRange)
      await this.$store.dispatch('getHistoricalCountryData')
    },

    setSelectedDataType: function(dataType: SelectItem[]): void {
      this.dataTypesSelected = dataType.map((data: SelectItem): string => data.name).join(', ')
      this.$store.commit('setSelectedCovidDataType', dataType)
    },

    setSelectedResultType: function(resultType: ResultType): void {
      this.$store.commit('setSelectedResultType', resultType)
    },

    setSelectedGraphType: function(graphType: GraphType): void {
      this.$store.commit('setSelectedGraphType', graphType)
    }
  }
})
</script>

<style lang="scss" scoped>

@import '../styles/main';

.covid-vis-controls-container {
  background-color: $primary-color;
  padding: 0 15px 0 15px;
  height: 100%;
  display: grid;
  align-content: center;
}

</style>
