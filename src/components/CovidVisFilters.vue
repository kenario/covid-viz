<template>
  <div class="cvd-filters-container">
    <h4 class="cvd-header">{{ generalHeader }}</h4>

    <div class="mb-2">{{ countryLabel }}</div>
    <Dropdown
      v-model="filtersStore.selectedCountry"
      :placeholder="countryPlaceholder"
      :options="dataStore.getters.allAffectedCountries"
      :optionLabel="'name'"
      :filter="true"
      :filter-placeholder="countrySearchbarPlaceholder"
      @update:model-value="onCountryChange"
    ></Dropdown>
      <!-- <div class="covid-vis-controls-general-filters covid-vis-controls-filters-styling">
        <dropdown
          :label="'Country'"
          :selectedItemLabel="getSelectedCountry"
        >
          <template v-slot="{ toggleDropdown }">
            <single-select
              :hasSearchBar="true"
              :searchbarPlaceholder="searchbarPlaceholder + ' Country'"
              :items="getAllAffectedCountries.map(countryInfo => { return { name: countryInfo.name, value: countryInfo.name } })"
              @itemSelect="setSelectedCountry($event); toggleDropdown()"
            />
          </template>
        </dropdown>
        <transition name="fade">
          <dropdown
            v-if="getSelectedCountry === 'USA' && getAllAffectedStates.length > 0"
            :label="'State'"
            :selectedItemLabel="getSelectedState"
          >
            <template v-slot="{ toggleDropdown }">
              <single-select
                :hasSearchBar="true"
                :items="getAllAffectedStates"
                :searchbarPlaceholder="searchbarPlaceholder + ' State'"
                @itemSelect="setSelectedState($event); toggleDropdown()"
              />
            </template>
          </dropdown>
        </transition>
        <transition name="fade">
          <dropdown
            v-if="getSelectedCountry === 'USA' && getSelectedState.length > 0"
            :label="'County'"
            :selectedItemLabel="getSelectedCounty"
          >
            <template v-slot="{ toggleDropdown }">
              <single-select
                :hasSearchBar="true"
                :items="getStatesAffectedCounties"
                :searchbarPlaceholder="searchbarPlaceholder + ' County'"
                @itemSelect="setSelectedCounty($event); toggleDropdown()"
              />
            </template>
          </dropdown>
        </transition>
      </div>
    </div>

    <div class="covid-vis-controls-rankings">
      <div class="covid-vis-controls-rankings-label covid-vis-controls-label-styling">
        {{ rankingsLabel }}
      </div>

      <div class="covid-vis-controls-rankings-filters covid-vis-controls-filters-styling">
        <dropdown
          :label="'Scale of Data'"
          :selectedItemLabel="getSelectedRankingDataScale.name"
        >
          <template v-slot="{ toggleDropdown }">
            <single-select
              :items="getRankingDataScales"
              @itemSelect="setSelectedRankingDataScale($event); toggleDropdown()"
            />
          </template>
        </dropdown>
      </div>
    </div>

    <div class="covid-vis-controls-graph">
      <div class="covid-vis-controls-graph-label covid-vis-controls-label-styling">
        {{ graphLabel }}
      </div>

      <template v-if="getSelectedCountry">
        <div class="covid-vis-controls-graph-filters covid-vis-controls-filters-styling">
          <dropdown
            v-if="getSelectedCountry === 'USA'"
            :label="'Scale of Data'"
            :selectedItemLabel="getSelectedGraphDataScale.name"
          >
            <template v-slot="{ toggleDropdown }">
              <single-select
                :items="getDataScales"
                @itemSelect="setSelectedGraphDataScale($event); toggleDropdown()"
              />
            </template>
          </dropdown>
          <dropdown
            :label="'Data Types'"
            :selectedItemLabel="getNumberOfSelectedCovidDataTypes"
          >
            <template>
              <multi-select
                :items="dataTypes"
                :selectedItems="getSelectedCovidDataTypes"
                :allItemsCheckedOnMount="true"
                @itemCheck="setSelectedDataType"
              />
            </template>
          </dropdown>
          <dropdown
            :label="'Results Type'"
            :selectedItemLabel="getSelectedGraphMeasurementType.name"
          >
            <template v-slot="{ toggleDropdown }">
              <single-select
                :items="resultTypes"
                @itemSelect="setSelectedGraphMeasurementType($event); toggleDropdown()"
              />
            </template>
          </dropdown>
          <dropdown
            :label="'Graph Type'"
            :selectedItemLabel="getSelectedGraphType.name"
          >
            <template v-slot="{ toggleDropdown }">
              <single-select
                :items="graphTypes"
                @itemSelect="setSelectedGraphType($event); toggleDropdown()"
              ></single-select>
            </template>
          </dropdown>

          <date-picker
            :label="'Dates'"
            :selectedDates="getSelectedDates"
            @selectDate="setSelectedDateRange"
          />
        </div>
      </template>

      <template v-else>
        <div class="covid-vis-controls-graph-no-country-selected covid-vis-controls-filters-styling">
          {{ noCountrySelected }}
        </div>
      </template>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import Vue, { reactive, ref } from 'vue'
import { CountryInfo, FilterItem } from '@/types'
import { useDataStore, useFiltersStore } from '@/stores';

const dataStore = useDataStore()
const filtersStore = useFiltersStore()

const generalHeader = 'GENERAL'
const countryPlaceholder = 'Select a country'
const countrySearchbarPlaceholder = 'Search for a country'
const countryLabel = 'Country'
const graphLabel = 'GRAPH'
const rankingsLabel = 'RANKINGS'
const noCountrySelected = 'Select a Country...'
const searchbarPlaceholder = 'Enter the name of a'

const resultTypes: FilterItem[] = reactive([
  {
    name: 'Total',
    value: 'total'
  },
  {
    name: 'Total Per Day',
    value: 'totalPerDay'
  },
])
const dataTypes: FilterItem[] = reactive([
  {
    name: 'Cases',
    value: 'cases'
  },
  {
    name: 'Recovered',
    value: 'recovered'
  },
  {
    name: 'Deaths',
    value: 'deaths'
  },
  {
    name: 'Vaccinated',
    value: 'vaccinated'
  },
])

const onCountryChange = (v: CountryInfo): void => {
  if (v.code !== filtersStore.selectedCovidCountryData.countryInfo?.iso2) {
    dataStore.actions.setSelectedCovidCountryData(v.name)
  }
}
    
// import { mapGetters } from 'vuex'
// import { DateRange, MeasurementType, GraphType, FilterItem, DataScale } from '@/types'
// import Dropdown from '@/shared/components/Dropdown.vue'
// import DatePicker from '@/shared/components/DatePicker.vue'
// import MultiSelect from '@/shared/components/selects/MultiSelect.vue'
// import SingleSelect from '@/shared/components/selects/SingleSelect.vue'

// export default Vue.extend({
//   name: 'CovidVisControls',

//   components: {
//     Dropdown,
//     DatePicker,
//     MultiSelect,
//     SingleSelect
//   },

//   computed: {
//     ...mapGetters([
//       'getDataScales',
//       'getRankingDataScales',
//       'getSelectedDates',
//       'getSelectedState',
//       'getSelectedCounty',
//       'getSelectedCountry',
//       'getSelectedGraphDataScale',
//       'getSelectedGraphType',
//       'getSelectedGraphMeasurementType',
//       'getSelectedRankingDataScale',
//       'getAllAffectedCountries',
//       'getAllAffectedStates',
//       'getStatesAffectedCounties',
//       'getSelectedCovidDataTypes',
//       'getNumberOfSelectedCovidDataTypes'
//     ])
//   },

//   data: () => ({
//     resultTypes: [
//       { name: 'Total', value: 'total' },
//       { name: 'Total Per Day', value: 'totalPerDay' }
//     ],
//     dataTypes: [
//       { name: 'Cases', value: 'cases' },
//       { name: 'Deaths', value: 'deaths' },
//       { name: 'Recovered', value: 'recovered' },
//       { name: 'Vaccinated', value: 'vaccinated' }
//     ],
//     graphTypes: [
//       { name: 'Line', value: 'line' },
//       { name: 'Bar', value: 'bar' }
//     ],
//     generalHeader: 'GENERAL',
//     graphLabel: 'GRAPH',
//     rankingsLabel: 'RANKINGS',
//     noCountrySelected: 'Select a Country...',
//     searchbarPlaceholder: 'Enter the name of a'
//   }),

//   methods: {
//     /*
//      * Sets the country and the countries data. */
//     setSelectedCountry: async function(country: FilterItem): Promise<void> {
//       this.$store.dispatch('setCountryDependents', country)

//       if (this.getSelectedCountry !== 'USA') {
//         /*
//          *` If the country is not the USA and we have a selected state and county, we unset.
//          * If our selected ranking type is nationwide, then we set to worldwide since data for
//          * other nations provinces is not yet available. */
//         if (this.getSelectedState.length > 0) this.$store.commit('setSelectedState', { name: '', value: '' })
//         if (this.getSelectedCounty.length > 0) this.$store.commit('setSelectedCounty', { name: '', value: '' })
//         if (this.getSelectedRankingDataScale.value === 'nationwide') {
//           this.$store.commit('setSelectedRankingDataScale', { name: 'Worldwide', value: 'worldwide' })
//         }
//       } else {
//         /*
//          * If the country is USA and we have not retrieved all states, we fetch the states. */
//         if (this.getAllAffectedStates.length < 1) {
//           await this.$store.dispatch('getCovidStateData')
//           await this.$store.dispatch('getCovidVaccineStateData')
//         }
//       }

//       await this.$store.dispatch('getHistoricalCountryData')
//     },

//     setSelectedState: async function(state: FilterItem): Promise<void> {
//       /* Unset the county if the state selected is not the currently selected state. */
//       if (this.getSelectedState !== state.name) this.$store.commit('setSelectedCounty', { name: '', value: '' })
//       if (this.getStatesAffectedCounties.length < 1) await this.$store.dispatch('getCovidCountyData')

//       await this.$store.dispatch('setUsaStateDependents', state)
//     },

//     setSelectedCounty: async function(county: FilterItem): Promise<void> {
//       await this.$store.dispatch('setUsaCountyDependents', county)
//     },

//     setSelectedDateRange: async function(dates: DateRange): Promise<void> {
//       this.$store.commit('setSelectedDates', dates)

//       if (this.getSelectedGraphDataScale.value === 'nationwide') {
//         await this.$store.dispatch('getHistoricalCountryData')
//       } else if (this.getSelectedGraphDataScale.value === 'statewide') {
//         await this.$store.dispatch('getHistoricalStateData')
//       } else {
//         await this.$store.dispatch('getHistoricalCountyData')
//       }
//     },

//     setSelectedDataType: function(dataType: FilterItem[]): void {
//       this.$store.commit('setSelectedCovidDataType', dataType)
//     },

//     setSelectedGraphMeasurementType: function(measurement: MeasurementType): void {
//       this.$store.commit('setSelectedGraphMeasurementType', measurement)
//     },

//     setSelectedGraphType: function(graphType: GraphType): void {
//       this.$store.commit('setSelectedGraphType', graphType)
//     },

//     setSelectedRankingDataScale: async function(scale: DataScale): Promise<void> {
//       /*
//        * If we change the rankings to nationwide and we do not have state data, fetch the data. */
//       if (scale.value === 'nationwide' && this.getAllAffectedStates.length < 1) {
//         await this.$store.dispatch('getCovidStateData')
//       }

//       this.$store.commit('setSelectedRankingDataScale', scale)
//     },

//     setSelectedGraphDataScale: async function(scale: DataScale): Promise<void> {
//       if (this.getSelectedGraphDataScale.value !== scale.value) {
//         if (scale.value === 'nationwide') await this.$store.dispatch('getHistoricalCountryData')
//         if (scale.value === 'statewide') await this.$store.dispatch('getHistoricalStateData')
//         // if (scale.value === 'countywide')
//         this.$store.commit('setSelectedGraphDataScale', scale)
//       }
//     },

//     closeButtonClick: function() {
//       this.$emit('closeButtonClick')
//     }
//   }
// })
</script>

<style lang="scss" scoped>
.cvd-header {
  color: var(--primary-color);
}
// p-dropdown belongs to the primevue dropdown component.
.p-dropdown {
  width: 18rem;
}
</style>
