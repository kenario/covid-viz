<template>
  <div class="covid-vis-container">
    <div class="covid-intro-layout">
      <transition name="fade">
        <covid-intro v-if="renderComponents" />
      </transition>
    </div>

    <div class="covid-totals-layout">
      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents"
          :title="'Worldwide'"
          :covidTotals="getCovidGlobalTotals"
        />
      </transition>
      <!-- We only render Nationwide totals if a country has been selected. -->
      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents && getSelectedCountry.length > 0"
          :title="'Nationwide'"
          :covidTotals="getCovidCountryTotals"
        />
      </transition>
      <!-- We only render Statewide totals if the country selected is the United States -->
      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents && renderStateTotals"
          :title="'Statewide'"
          :covidTotals="getCovidStateTotals"
        />
      </transition>
      <!-- We only render Countywide totals if a state has been selected -->
      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents && renderCountyTotals"
          :title="'Countywide'"
          :covidTotals="getCovidCountyTotals"
        />
      </transition>
    </div>
    <!-- <transition name="fade">
      <covid-totals v-if="renderComponents" />
    </transition> -->
    <!-- <transition name="fade">
      <covid-vis-controls />
    </transition> -->

    <!-- <transition name="fade">
      <covid-chart v-show="renderComponents" />
    </transition>

    <Footer /> -->
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { mapGetters } from 'vuex'
import Footer from './Footer.vue'
import CovidChart from './CovidChart.vue'
import CovidIntro from './CovidIntro.vue'
import axios, { AxiosResponse } from 'axios'
import { geolocationEP } from '../shared/constants/geolocationEP'
import CovidTotals from '../shared/components/CovidTotals.vue'
import {
  CountryInfo,
  GeolocationResponse,
  GeolocationPosition
} from '../types'

export default Vue.extend({
  name: 'CovidVis',

  components: {
    // Footer,
    CovidTotals,
    // CovidVisControls,
    // CovidChart,
    CovidIntro
  },

  computed: {
    ...mapGetters([
      'renderStateTotals',
      'renderCountyTotals',
      'getAllAffectedCountries',
      'getAllAffectedStates',
      'getCovidCountryTotals',
      'getCovidGlobalTotals',
      'getCovidStateTotals',
      'getCovidCountyTotals',
      'getSelectedCountry',
      'getSelectedState',
      'getSelectedCounty'
    ])
  },

  data: () => ({
    geolocationCountry: '',
    renderComponents: false
  }),
  /*
   * Created and Mount hook represent the Vuex store's entry point for initializing default state.
   */
  created() {
    this.$store.commit('setSelectedGraphType', { name: 'Line', value: 'line' })
    this.$store.commit('setSelectedResultType', { name: 'Total', value: 'total' })
    this.$store.commit('setSelectedCovidDataType', [
      { name: 'Cases', value: 'cases' },
      { name: 'Recovered', value: 'recovered' },
      { name: 'Deaths', value: 'deaths' }
    ])
    /*
     * Conditional rendering of components to allow for transitions.
     */
    setTimeout(() => { this.renderComponents = true }, 500)
  },

  async mounted() {
    await this.$store.dispatch('getCovidGlobalData')
    await this.$store.dispatch('getCovidVaccineGlobalData')
    await this.$store.dispatch('getCovidCountryData')
    await this.$store.dispatch('getCovidVaccineCountryData')
    this.locateUser()
  },

  methods: {
    /* If geolocation is available and the user clicks allow then we compare the location to the
       country codes of the countries affected by covid. */
    locateUser(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position: GeolocationPosition): Promise<void> => {
          const res: AxiosResponse<GeolocationResponse> = await axios
            .get(geolocationEP(position.coords.latitude, position.coords.longitude))

          /* Find the countries name by using the country code given. */
          this.geolocationCountry = this.getAllAffectedCountries.find((countryInfo: CountryInfo): boolean =>
            res.data.address.country_code.toUpperCase() === countryInfo.countryCode).name

          /* Set the selectedCountry and selectedCovidCountryData with that country.  Afterwards we ping
             that countries historical data. */
          this.$store.commit('setSelectedCountry', {
            name: this.geolocationCountry,
            value: this.geolocationCountry.toLowerCase()
          })
          this.$store.commit('setSelectedCovidCountryData')
          await this.$store.dispatch('getHistoricalCountryData')

          /* If the users geolocation is the United States, we also fetch the users state and county data */
          if (this.geolocationCountry.toLowerCase() === 'usa') {
            const state = res.data.address.state
            const county = res.data.address.county.replace(' County', '')

            await this.$store.dispatch('getCovidStateData')
            this.$store.commit('setSelectedState', { name: state, value: state.toLowerCase() })
            this.$store.commit('setSelectedCovidStateData')

            await this.$store.dispatch('getCovidCountyData')
            this.$store.commit('setSelectedCounty', { name: county, value: county.toLowerCase() })
            this.$store.commit('setSelectedCovidCountyData')
          }
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.fade-slide-left-enter-active, .fade-slide-left-leave-active {
  transition: all 1.5s ease;
}
.fade-slide-left-enter, .fade-slide-left-leave-to {
  transform: translateX(200px);
  opacity: 0;
}
.fade-slide-left-move {
  transition: transform 1s;
}
.covid-vis-container {
  display: grid;
  grid-gap: 1.5rem;
  grid-auto-rows: auto;
}
.covid-intro-layout {
  grid-row-start: 2;
  grid-row-end: 3;
}
.covid-totals-layout {
  /* parent grid */
  grid-row-start: 3;
  grid-row-end: 4;
  /* totals grid */
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(300px, 300px));
  padding: 0 10% 0 10%;
  transition: 2s;
}
</style>
