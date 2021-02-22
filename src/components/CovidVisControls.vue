<template>
  <div class="covid-vis-controls-container">
    <div class="covid-vis-controls-close-button">
      <div
        class="material-icons covid-vis-controls-close-icon"
        @click="closeButtonClick"
      >
        close
      </div>
    </div>
    <!-- Country dropdown -->
    <dropdown
      :label="'Country'"
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
    <!-- State dropdown -->
    <dropdown
      v-if="getSelectedCountry === 'USA' && getAllAffectedStates.length > 0"
      :label="'State'"
      :selectedItem="getSelectedState"
    >
      <template v-slot="{ toggleDropdown }">
        <single-select
          :hasSearchBar="true"
          :items="getAllAffectedStates"
          @selectedItem="setSelectedState($event); toggleDropdown()"
        />
      </template>
    </dropdown>
    <!-- County dropdown -->
    <dropdown
      v-if="getSelectedCountry === 'USA' && getSelectedState.length > 0"
      :label="'County'"
      :selectedItem="getSelectedCounty"
    >
      <template v-slot="{ toggleDropdown }">
        <single-select
          :hasSearchBar="true"
          :items="getStatesAffectedCounties"
          @selectedItem="setSelectedCounty($event); toggleDropdown()"
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
      :label="'Data Types'"
      :selectedItem="getNumberOfSelectedCovidDataTypes"
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
      'getSelectedState',
      'getSelectedCounty',
      'getSelectedGraphType',
      'getSelectedResultType',
      'getAllAffectedCountries',
      'getAllAffectedStates',
      'getStatesAffectedCounties',
      'getNumberOfSelectedCovidDataTypes'
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
    ]
  }),

  methods: {
    /* Also checks if selected country is USA and fetches state data if we do not have prior state data.
       If */
    setSelectedCountry: async function(country: SelectItem): Promise<void> {
      this.$store.commit('setSelectedCountry', country)
      this.$store.commit('setSelectedCovidCountryData')
      await this.$store.dispatch('getHistoricalCountryData')

      if (country.value.toLowerCase() === 'usa' && this.getAllAffectedStates.length < 1) {
        await this.$store.dispatch('getCovidStateTotals')
      }
    },
    /* Sets the state, if covidCountyTotals is empty, we fetch the data.  We also unset the county if
       the state selected is not the currently selected state. */
    setSelectedState: async function(state: SelectItem): Promise<void> {
      if (this.getSelectedState !== state.name) {
        this.$store.commit('setSelectedCounty', { name: '', value: '' })
      }
      this.$store.commit('setSelectedState', state)
      this.$store.commit('setSelectedCovidStateData')

      if (this.getStatesAffectedCounties.length < 1) {
        await this.$store.dispatch('getCovidCountyTotals')
      }
    },

    setSelectedCounty: function(county: SelectItem): void {
      this.$store.commit('setSelectedCounty', county)
      this.$store.commit('setSelectedCovidCountyData')
    },

    setSelectedDateRange: async function(dates: Date[]): Promise<void> {
      const dateRange: DateRange = { startDate: dates[0], endDate: dates[1] }
      this.$store.commit('setSelectedDates', dateRange)
      await this.$store.dispatch('getHistoricalCountryData')
    },

    setSelectedDataType: function(dataType: SelectItem[]): void {
      this.$store.commit('setSelectedCovidDataType', dataType)
    },

    setSelectedResultType: function(resultType: ResultType): void {
      this.$store.commit('setSelectedResultType', resultType)
    },

    setSelectedGraphType: function(graphType: GraphType): void {
      this.$store.commit('setSelectedGraphType', graphType)
    },

    closeButtonClick: function() {
      this.$emit('closeButtonClick')
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
.covid-vis-controls-close-button {
  color: $secondary-color;
}
.covid-vis-controls-close-icon {
  float: right;
  position: relative;
  right: 5px;
}
.covid-vis-controls-close-icon:hover {
  cursor: pointer;
  color: $accent-color;
}
</style>
