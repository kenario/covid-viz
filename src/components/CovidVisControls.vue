<template>
  <div class="covid-vis-controls-container">
    <div
      class="covid-vis-controls-close-button"
      :class="{ 'covid-vis-controls-close-button--add-margin-top': getSelectedCountry }"
    >
      <div
        class="material-icons covid-vis-controls-close-icon"
        @click="closeButtonClick"
      >
        close
      </div>
    </div>

    <div class="covid-vis-controls-general">
      <div class="covid-vis-controls-general-label covid-vis-controls-label-styling">
        {{ generalLabel }}
      </div>

      <div class="covid-vis-controls-general-filters covid-vis-controls-filters-styling">
        <!-- Country dropdown -->
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
        <!-- State dropdown -->
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
        <!-- County dropdown -->
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
          :label="'Ranking Type'"
          :selectedItemLabel="getSelectedRankingType.name"
        >
          <template v-slot="{ toggleDropdown }">
            <single-select
              :items="getRankingTypes"
              @itemSelect="setSelectedRankingType($event); toggleDropdown()"
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
          <!-- Data Scale dropdown -->
          <dropdown
            v-if="getSelectedCountry === 'USA'"
            :label="'Scale of Data'"
            :selectedItemLabel="getSelectedDataScale.name"
          >
            <template v-slot="{ toggleDropdown }">
              <single-select
                :items="getDataScales"
                @itemSelect="setSelectedDataScale($event); toggleDropdown()"
              />
            </template>
          </dropdown>
          <!-- Data type dropdown -->
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
          <!-- Result type dropdown -->
          <dropdown
            :label="'Results Type'"
            :selectedItemLabel="getSelectedResultType.name"
          >
            <template v-slot="{ toggleDropdown }">
              <single-select
                :items="resultTypes"
                @itemSelect="setSelectedResultType($event); toggleDropdown()"
              />
            </template>
          </dropdown>
          <!-- Type of graph dropdown -->
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

          <!-- Date picker dropdown -->
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
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { mapGetters } from 'vuex'
import { DateRange, ResultType, GraphType, SelectItem, RankingType } from '@/types'
import Dropdown from '@/shared/components/Dropdown.vue'
import DatePicker from '@/shared/components/DatePicker.vue'
import MultiSelect from '@/shared/components/selects/MultiSelect.vue'
import SingleSelect from '@/shared/components/selects/SingleSelect.vue'

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
      'getDataScales',
      'getRankingTypes',
      'getSelectedDates',
      'getSelectedState',
      'getSelectedCounty',
      'getSelectedCountry',
      'getSelectedDataScale',
      'getSelectedGraphType',
      'getSelectedResultType',
      'getSelectedRankingType',
      'getAllAffectedCountries',
      'getAllAffectedStates',
      'getStatesAffectedCounties',
      'getSelectedCovidDataTypes',
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
      { name: 'Recovered', value: 'recovered' },
      { name: 'Vaccinated', value: 'vaccinated' }
    ],
    graphTypes: [
      { name: 'Line', value: 'line' },
      { name: 'Bar', value: 'bar' }
    ],
    generalLabel: 'GENERAL',
    graphLabel: 'GRAPH',
    rankingsLabel: 'RANKINGS',
    noCountrySelected: 'Select a Country...',
    searchbarPlaceholder: 'Enter the name of a'
  }),

  methods: {
    /*
     * Sets the country and the countries data. */
    setSelectedCountry: async function(country: SelectItem): Promise<void> {
      this.$store.dispatch('setCountryDependents', country)

      if (this.getSelectedCountry !== 'USA') {
        /*
         * If the country is not the USA and we have a selected state and county, we unset.
         * If our selected ranking type is nationwide, then we set to worldwide since data for
         * other nations provinces is not yet available. */
        if (this.getSelectedState.length > 0) this.$store.commit('setSelectedState', { name: '', value: '' })
        if (this.getSelectedCounty.length > 0) this.$store.commit('setSelectedCounty', { name: '', value: '' })
        if (this.getSelectedRankingType.value === 'nationwide') {
          this.$store.commit('setSelectedRankingType', { name: 'Worldwide', value: 'worldwide' })
        }
      } else {
        /*
         * If the country is USA and we have not retrieved all states, we fetch the states. */
        if (this.getAllAffectedStates.length < 1) {
          await this.$store.dispatch('getCovidStateData')
          await this.$store.dispatch('getCovidVaccineStateData')
        }
      }

      await this.$store.dispatch('getHistoricalCountryData')
    },

    /* Sets the state, if covidCountyTotals is empty, we fetch the data.  We also unset the county if
       the state selected is not the currently selected state. */
    setSelectedState: async function(state: SelectItem): Promise<void> {
      await this.$store.dispatch('setUsaStateDependents', state)

      if (this.getSelectedState !== state.name) this.$store.commit('setSelectedCounty', { name: '', value: '' })
      if (this.getStatesAffectedCounties.length < 1) await this.$store.dispatch('getCovidCountyData')
    },

    setSelectedCounty: function(county: SelectItem): void {
      this.$store.commit('setSelectedCounty', county)
    },

    setSelectedDateRange: async function(dates: DateRange): Promise<void> {
      this.$store.commit('setSelectedDates', dates)

      if (this.getSelectedDataScale.value === 'nationwide') {
        await this.$store.dispatch('getHistoricalCountryData')
      } else {
        await this.$store.dispatch('getHistoricalStateData')
      }
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

    setSelectedRankingType: async function(rankingType: RankingType): Promise<void> {
      /*
       * If we change the rankings to nationwide and we do not have state data, fetch the data. */
      if (rankingType.value === 'nationwide' && this.getAllAffectedStates.length < 1) {
        await this.$store.dispatch('getCovidStateData')
      }

      this.$store.commit('setSelectedRankingType', rankingType)
    },

    setSelectedDataScale: async function(scale: RankingType): Promise<void> {
      if (this.getSelectedDataScale.value !== scale.value) {
        if (scale.value === 'nationwide') await this.$store.dispatch('getHistoricalCountryData')
        if (scale.value === 'statewide') await this.$store.dispatch('getHistoricalStateData')
        // if (scale.value === 'countywide')
        this.$store.commit('setSelectedDataScale', scale)
      }
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
  padding: 0 15px 0 15px;
  display: grid;
  align-content: center;
}
.covid-vis-controls-close-button {
  color: white;
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
.covid-vis-controls-filters-styling {
  padding-left: 10px;
}
.covid-vis-controls-label-styling {
  margin: 25px 0 10px 0;
  color: white;
  font-size: 0.8rem;
}
.covid-vis-controls-graph-no-country-selected {
  font-style: italic;
  font-size: 0.9rem;
  color: #cccfba;
}

// // Allows the filters to scroll and for the close button and date picker to be visible.
@media only screen and (max-width: 768px) {
  .covid-vis-controls-graph-filters {
    margin-bottom: 100px;
  }
}

</style>
