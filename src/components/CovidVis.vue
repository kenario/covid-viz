<template>
  <v-container
    fluid
    class="ma-0 pa-0"
  >
    <v-row
      class="ma-0"
    >
      <Header />
    </v-row>

    <v-row>
      <v-col
        class="ml-2 mt-2 mb-2 mr-0 pt-0 pb-0"
      >
        <covid-general-info />
      </v-col>

      <v-col
        class="ml-0 mt-2 mb-2 mr-2 pt-0 pb-0"
      >
        <covid-vis-controls />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <covid-chart />
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
    location: 'USA'
  }),
  /**
   * Created and Mount hook represent the Vuex store's entry point for initializing data.
   */
  created() {
    this.$store.commit('setSelectedGraphType', { name: 'Line', value: 'line' })
    this.$store.commit('setSelectedResultType', { name: 'Total', value: 'total' })
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
