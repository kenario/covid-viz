<template>
  <v-container
    fluid
    class="ma-0 pa-0"
  >
    <v-row
      class="ma-0"
    >
      <transition name="fade-slide-down">
        <Header v-if="renderHeader" />
      </transition>
    </v-row>

    <v-row>
      <v-col
        class="ml-2 mt-2 mb-2 mr-0 pt-0 pb-0"
      >
        <transition name="fade">
          <covid-general-info v-if="renderComponents" />
        </transition>
      </v-col>

      <v-col
        class="ml-0 mt-2 mb-2 mr-2 pt-0 pb-0"
      >
        <transition name="fade">
          <covid-vis-controls v-if="renderComponents" />
        </transition>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <transition name="fade">
          <covid-chart v-show="renderComponents" />
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import Vue from 'vue'
import { mapGetters } from 'vuex'
import Header from './Header.vue'
import CovidChart from './CovidChart.vue'
import CovidGeneralInfo from './CovidGeneralInfo.vue'
import CovidVisControls from './CovidVisControls.vue'
import { geolocationEP } from '../shared/constants/geolocationEP'
import { CountryInfo } from '../types'

/**
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
    Header,
    CovidGeneralInfo,
    CovidVisControls,
    CovidChart
  },

  computed: {
    ...mapGetters([
      'getAllAffectedCountries'
    ])
  },

  data: () => ({
    location: 'USA',
    renderHeader: false,
    renderComponents: false
  }),
  /**
   * Created and Mount hook represent the Vuex store's entry point for initializing data.
   */
  created() {
    this.$store.commit('setSelectedGraphType', { name: 'Line', value: 'line' })
    this.$store.commit('setSelectedResultType', { name: 'Total', value: 'total' })
    /**
     * Conditional rendering of components to allow for transitions.
     */
    setTimeout(() => { this.renderHeader = true }, 100)
    setTimeout(() => {
      if (this.renderHeader) {
        this.renderComponents = true
      }
    }, 500)
  },

  async mounted() {
    await this.$store.dispatch('getCovidDataAllCountries')
    this.$store.commit('setSelectedCountry', { name: this.location, value: this.location })
    this.$store.commit('setSelectedCovidData')
    await this.$store.dispatch('getHistoricalCountryData')
    this.locateUser()
  },

  methods: {
    /**
     * If geolocation is available and the user clicks allow then we compare the location to the
     * country codes of the countries affected by covid.
     */
    locateUser(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position: GeolocationPosition): Promise<void> => {
          const res = await fetch(geolocationEP(position.coords.latitude, position.coords.longitude))
          const data = await res.json()
          /**
           * Find the countries name by using the country code given.
           */
          this.location = this.getAllAffectedCountries.find((countryInfo: CountryInfo): boolean =>
            data.address.country_code.toUpperCase() === countryInfo.countryCode).name
          /**
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
.fade-slide-down-enter-active, .fade-slide-down-leave-active {
  transition: all 1s ease;
}
.fade-slide-down-enter, .fade-slide-down-leave-to {
  transform: translateY(-70px);
  opacity: 0.5;
}
.fade-enter-active, .fade-leave-active {
  transition: all 1.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
