<template>
  <v-card
    :color="$vuetify.theme.themes.light.primary"
    min-height="436"
    width="100%"
  >
    <div class="pl-5 pr-5 pt-2 pb-2">

      <!-- Country dropdown -->
      <dropdown
        :label="'Country'"
        :hasSearch="true"
        :selectedItem="getSelectedCountry"
      >
        <template v-slot="{ searchText, toggleDropdown }">
          <single-select
            :searchText="searchText"
            :items="getAllAffectedCountries.map(countryInfo => { return { name: countryInfo.name, value: countryInfo.name } })"
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
        :selectedItem="getSelectedResultType.name"
      >
        <template v-slot="{ toggleDropdown }">
          <single-select
            :items="resultTypes"
            :toggleDropdown="toggleDropdown"
            @selectedItem="setSelectedResultType"
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
            :toggleDropdown="toggleDropdown"
            @selectedItem="setSelectedGraphType"
          ></single-select>
        </template>
      </dropdown>
    </div>
  </v-card>
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
      'cases',
      'deaths',
      'recovered'
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

    setSelectedDataType: function(dataType: string[]): void {
      this.dataTypesSelected = dataType.join(', ')
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
