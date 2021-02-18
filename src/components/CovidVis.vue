<template>
  <div class="covid-vis-container">
    <div class="covid-intro-layout">
      <transition name="fade">
        <covid-intro v-if="renderComponents" />
      </transition>
    </div>

    <div class="covid-general-info-layout">
      <transition name="fade-slide-left">
        <covid-general-info
          v-if="renderComponents"
          :title="'Worldwide'"
          :covidGeneralInfo="getCovidGlobalTotals"
        />
      </transition>
      <!-- We only render Nationwide information if a country has been selected. -->
      <transition name="fade-slide-left">
        <covid-general-info
          v-if="renderComponents && getSelectedCountry.length > 0"
          :title="'Nationwide'"
          :covidGeneralInfo="getCovidCountryTotals"
        />
      </transition>
    </div>
    <!-- <transition name="fade">
      <covid-general-info v-if="renderComponents" />
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
import CovidGeneralInfo from '../shared/components/CovidGeneralInfo.vue'
import CovidVisControls from './CovidVisControls.vue'
import { geolocationEP } from '../shared/constants/geolocationEP'
import { CountryInfo } from '../types'

/*
 * These two interfaces from Mozilla seem to not be exported, despite being available in the api.
 */
interface GeolocationCoordinates {
    readonly accuracy: number;
    readonly altitude: number | null;
    readonly altitudeAccuracy: number | null;
    readonly heading: number | null;
    readonly latitude: number;
    readonly longitude: number;
    readonly speed: number | null;
}

interface GeolocationPosition {
    readonly coords: GeolocationCoordinates;
    readonly timestamp: number;
}

export default Vue.extend({
  name: 'CovidVis',

  components: {
    // Footer,
    CovidGeneralInfo,
    // CovidVisControls,
    // CovidChart,
    CovidIntro
  },

  computed: {
    ...mapGetters([
      'getAllAffectedCountries',
      'getCovidCountryTotals',
      'getCovidGlobalTotals',
      'getSelectedCountry'
    ])
  },

  data: () => ({
    location: '',
    renderComponents: false
  }),
  /*
   * Created and Mount hook represent the Vuex store's entry point for initializing data.
   */
  created() {
    this.$store.commit('setSelectedGraphType', { name: 'Line', value: 'line' })
    this.$store.commit('setSelectedResultType', { name: 'Total', value: 'total' })
    /*
     * Conditional rendering of components to allow for transitions.
     */
    setTimeout(() => { this.renderComponents = true }, 500)
  },

  async mounted() {
    await this.$store.dispatch('getCovidGlobalTotals')
    await this.$store.dispatch('getCovidDataAllCountries')
    this.locateUser()
  },

  methods: {
    /*
     * If geolocation is available and the user clicks allow then we compare the location to the
     * country codes of the countries affected by covid.
     */
    locateUser(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position: GeolocationPosition): Promise<void> => {
          const res = await fetch(geolocationEP(position.coords.latitude, position.coords.longitude))
          const data = await res.json()
          /*
           * Find the countries name by using the country code given.
           */
          this.location = this.getAllAffectedCountries.find((countryInfo: CountryInfo): boolean =>
            data.address.country_code.toUpperCase() === countryInfo.countryCode).name
          /*
           * Mutate the selectedCountry and selectedCovidData state with that country.  Afterwards we
           * ping that countries historical data.
           */
          this.$store.commit('setSelectedCountry', { name: this.location, value: this.location })
          this.$store.commit('setSelectedCovidData')
          await this.$store.dispatch('getHistoricalCountryData')
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 1.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-slide-left-enter-active, .fade-slide-left-leave-active {
  transition: all 1.5s ease;
}
.fade-slide-left-enter, .fade-slide-left-leave-to {
  transform: translateX(200px);
  opacity: 0;
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
.covid-general-info-layout {
  /* parent grid */
  grid-row-start: 3;
  grid-row-end: 4;
  /* general info grid */
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(300px, 300px));
  padding: 0 10% 0 10%;
}
</style>
