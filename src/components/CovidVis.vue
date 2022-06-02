<template>
  <section class="cvd-intro flex justify-content-center">
    <CovidIntro class="w-10 mt-5"/>
  </section>

  <section class="cvd-totals-container">
    <h1 class="cvd-totals-header flex justify-content-center">
      {{ totalsHeader }}
    </h1>
    
    <div class="grid">
      <div class="lg:col"></div>

      <CovidTotals
        class="lg:col-fixed sm:col-12"
        title="Worldwide"
        :totals="dataStore.getters.globalTotals"
      />
  
      <CovidTotals
        v-if="filtersStore.selectedCountry.code !== undefined"
        class="col-fixed"
        title="Countrywide"
        :totals="dataStore.getters.countryTotals"
      />

      <CovidTotals
        v-if="filtersStore.selectedState.value !== undefined"
        class="col-fixed"
        title="Statewide"
        :totals="dataStore.getters.stateTotals"
      />      

      <div class="lg:col"></div>
    </div>
  </section>
    <!-- <div class="covid-totals-layout">
        <covid-totals
          v-if="renderComponents"
          :title="'Worldwide'"
          :totals="getCovidGlobalTotals"
        />

        <covid-totals
          v-if="renderComponents"
          :title="'Nationwide'"
          :totals="getCovidCountryTotals"
        >
          {{ countryNotification }}
        </covid-totals>

        <covid-totals
          v-if="renderComponents"
          :title="'Statewide'"
          :totals="getCovidStateTotals"
        >
          {{ totalsStateNotification }}
        </covid-totals>

        <covid-totals
          v-if="renderComponents"
          :title="'Countywide'"
          :totals="getCovidCountyTotals"
        >
          {{ totalsCountyNotification }}
        </covid-totals>
    `</div> -->
    <!-- Covid Rankings header -->
    <!-- <div class="covid-ranking-title-layout">
        <div
          v-if="renderComponents"
          class="covid-ranking-title section-title-font"
        >
          {{ rankingTitle }}
        </div>
    </div> -->
    <!-- Covid Rankings -->
    <!-- <div class="covid-ranking-layout">
      <template v-for="(rankings, index) in getCovidRankings">
          name="fade-slide-left"
          :key="index"
        >
          <covid-ranking
            v-if="renderComponents"
            :title="rankings.label"
            :items="rankings.data"
          />
      </template>
    </div> -->
    <!--  Covid Graph header -->
    <!-- <div class="covid-graph-title-layout">
        <div
          v-if="renderComponents"
          class="covid-graph-title section-title-font"
        >
          {{ graphTitle }}
        </div>
    </div> -->
    <!--  Covid Graph -->
      <!-- <div
        v-if="renderComponents"
        class="covid-graph-layout"
      >
        <covid-chart>
          {{ countryNotification }}
        </covid-chart>
      </div> -->

    <!-- <Footer /> -->
  <!-- </section> -->
</template>

<script setup lang="ts">
import Vue, { onMounted, reactive, ref } from 'vue'
import CovidIntro from './CovidIntro.vue'
import CovidRanking from '@/shared/components/CovidRanking.vue'
import CovidTotals from '@/shared/components/CovidTotals.vue'
import axios, { AxiosResponse } from 'axios'
import { geolocationEP } from '@/shared/constants/geolocationEP'
import {
  CountryInfo,
  GeolocationResponse,
  GeolocationPosition
} from '@/types'

import { Store } from 'pinia'
import { useDataStore } from '@/stores'
import { useFiltersStore } from '@/stores'

const dataStore = useDataStore()
const filtersStore = useFiltersStore()

const chartHeader = 'TREND'
const totalsHeader = 'TOTALS'
const rankingsHeader = 'RANKINGS'
const usaOnlyNotification = 'data is only available if the country selected is USA.'
const countryNotification = 'Select a country or allow location access.'

const geolocationCountry = ref('')
const initialDataScale = reactive({ name: 'Nationwide', value: 'nationwide' })

onMounted(async () => {
  await Promise.all([
    dataStore.actions.fetchCovidGlobalData(),
    dataStore.actions.fetchCovidCountryData(),
    dataStore.actions.fetchCovidVaccineGlobalData(),
    dataStore.actions.fetchCovidVaccineCountryData(),
  ])
})

/* If geolocation is available and the user clicks allow then we compare the location to the
   country codes of the countries affected by covid. */
// const locateUser = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(async (position: GeolocationPosition): Promise<void> => {
//       const res: AxiosResponse<GeolocationResponse> = await axios
//         .get(geolocationEP(position.coords.latitude, position.coords.longitude))

//       /* Find the countries name by using the country code given. */
//       geolocationCountry = dataStore.getters.allAffectedCountries.find((countryInfo: CountryInfo): boolean =>
//         res.data.address.country_code.toUpperCase() === countryInfo.countryCode).name

//       /* Set the selectedCountry and selectedCovidCountryData with that country.  Afterwards we ping
//           that countries historical data if we don't already have it. */
//       this.$store.dispatch('setCountryDependents', {
//         name: this.geolocationCountry,
//         value: this.geolocationCountry.toLowerCase()
//       })
//       await this.$store.dispatch('getHistoricalCountryData')

//       /*
//         * If the users geolocation is the United States, we also fetch the users state and county data
//         * if we don't already have it. */
//       if (this.geolocationCountry.toLowerCase() === 'usa') {
//         const state = res.data.address.state
//         const county = res.data.address.county?.replace(' County', '')

//         if (this.getAllAffectedStates.length < 1) {
//           await this.$store.dispatch('getCovidStateData')
//           await this.$store.dispatch('getCovidVaccineStateData')
//           await this.$store.dispatch('setUsaStateDependents', { name: state, value: state.toLowerCase() })
//         }

//         if (this.getStatesAffectedCounties.length < 1) await this.$store.dispatch('getCovidCountyData')

//         /*
//           * Somtimes when pinging the geolocation API, county data is not available, we have this check
//           * just in case. */
//         if (county) {
//           this.$store.commit('setSelectedCounty', { name: county, value: county.toLowerCase() })
//           await this.$store.dispatch('setUsaCountyDependents', { name: county, value: county.toLowerCase() })
//         }
//       }
//     })
//   }
// }
// filtersStore.selectedGraphType = { name: 'Line', value: 'line' }

// export default Vue.extend({
//   name: 'CovidVis',

//   components: {
//     CovidTotals,
//     CovidRanking,
//     CovidChart,
//     CovidIntro
//   },

//   computed: {
//     ...mapGetters([
//       'getIsLoading',
//       'getCovidRankings',
//       'getSelectedState',
//       'renderStateTotals',
//       'getSelectedCounty',
//       'renderCountyTotals',
//       'getSelectedCountry',
//       'getCovidStateTotals',
//       'getAllAffectedStates',
//       'getCovidGlobalTotals',
//       'getCovidCountyTotals',
//       'getCovidCountryTotals',
//       'getAllAffectedCountries',
//       'getStatesAffectedCounties'
//     ]),
//     totalsStateNotification: function(): string {
//       return this.getSelectedCountry === 'USA'
//         ? 'Select a state or allow location access.'
//         : `State ${this.usaOnlyNotification}`
//     },
//     totalsCountyNotification: function(): string {
//       return this.getSelectedCountry && this.getSelectedState
//         ? 'Select a county or allow location access.'
//         : (`County ${this.usaOnlyNotification} and a State has been selected.`).replace('.', '')
//     }
//   },

//   data: () => ({
//     geolocationCountry: '',
//     renderComponents: false,
//     usaOnlyNotification: 'data is only available if the country selected is USA.',
//     totalsHeader: 'TOTALS',
//     countryNotification: 'Select a country or allow location access.',
//     rankingTitle: 'RANKINGS',
//     graphTitle: 'GRAPH',
//     initialDataScale: { name: 'Nationwide', value: 'nationwide' }
//   }),
//   /*
//    * Created and Mount hook represent the Vuex store's entry point for initializing default state.
//    */
//   created() {
//     this.$store.commit('setSelectedGraphType', { name: 'Line', value: 'line' })
//     this.$store.commit('setSelectedGraphMeasurementType', { name: 'Total', value: 'total' })
//     this.$store.commit('setSelectedRankingDataScale', { name: 'Worldwide', value: 'worldwide' })
//     this.$store.commit('setSelectedCovidDataType', [
//       { name: 'Cases', value: 'cases' },
//       { name: 'Recovered', value: 'recovered' },
//       { name: 'Deaths', value: 'deaths' },
//       { name: 'Vaccinated', value: 'vaccinated' }
//     ])
//     this.$store.commit('setSelectedGraphDataScale', this.initialDataScale)
//     this.$store.commit('addDataScale', this.initialDataScale)
//     /*
//      * Conditional rendering of components to allow for transitions.
//      */
//     setTimeout(() => { this.renderComponents = true }, 500)
//   },

//   async mounted() {
//     await Promise.all([
//       this.$store.dispatch('getCovidGlobalData'),
//       this.$store.dispatch('getCovidCountryData')
//     ])
//     await Promise.all([
//       this.$store.dispatch('getCovidVaccineGlobalData'),
//       this.$store.dispatch('getCovidVaccineCountryData')
//     ])
//     this.locateUser()
//   },

//   methods: {
//     /* If geolocation is available and the user clicks allow then we compare the location to the
//        country codes of the countries affected by covid. */
//     locateUser(): void {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(async (position: GeolocationPosition): Promise<void> => {
//           const res: AxiosResponse<GeolocationResponse> = await axios
//             .get(geolocationEP(position.coords.latitude, position.coords.longitude))

//           /* Find the countries name by using the country code given. */
//           this.geolocationCountry = this.getAllAffectedCountries.find((countryInfo: CountryInfo): boolean =>
//             res.data.address.country_code.toUpperCase() === countryInfo.countryCode).name

//           /* Set the selectedCountry and selectedCovidCountryData with that country.  Afterwards we ping
//              that countries historical data if we don't already have it. */
//           this.$store.dispatch('setCountryDependents', {
//             name: this.geolocationCountry,
//             value: this.geolocationCountry.toLowerCase()
//           })
//           await this.$store.dispatch('getHistoricalCountryData')

//           /*
//            * If the users geolocation is the United States, we also fetch the users state and county data
//            * if we don't already have it. */
//           if (this.geolocationCountry.toLowerCase() === 'usa') {
//             const state = res.data.address.state
//             const county = res.data.address.county?.replace(' County', '')

//             if (this.getAllAffectedStates.length < 1) {
//               await this.$store.dispatch('getCovidStateData')
//               await this.$store.dispatch('getCovidVaccineStateData')
//               await this.$store.dispatch('setUsaStateDependents', { name: state, value: state.toLowerCase() })
//             }

//             if (this.getStatesAffectedCounties.length < 1) await this.$store.dispatch('getCovidCountyData')

//             /*
//              * Somtimes when pinging the geolocation API, county data is not available, we have this check
//              * just in case. */
//             if (county) {
//               this.$store.commit('setSelectedCounty', { name: county, value: county.toLowerCase() })
//               await this.$store.dispatch('setUsaCountyDependents', { name: county, value: county.toLowerCase() })
//             }
//           }
//         })
//       }
//     }
//   }
// })
</script>

<style lang="scss" scoped>
.cvd-totals-header {
  color: var(--primary-color)
}
</style>