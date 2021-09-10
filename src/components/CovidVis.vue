<template>
  <div class="covid-vis-container">
    <div class="covid-intro-layout">
      <transition name="fade">
        <covid-intro v-if="renderComponents" />
      </transition>
    </div>
    <!-- Covid Totals header -->
    <div class="covid-totals-title-layout section-title-font">
      <transition name="fade">
        <div
          v-if="renderComponents"
          class="covid-totals-title"
        >
          {{ totalsTitle }}
        </div>
      </transition>
    </div>
    <!-- Covid Totals -->
    <div class="covid-totals-layout">
      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents"
          :title="'Worldwide'"
          :totals="getCovidGlobalTotals"
        />
      </transition>

      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents"
          :title="'Nationwide'"
          :totals="getCovidCountryTotals"
        >
          {{ countryNotification }}
        </covid-totals>
      </transition>

      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents"
          :title="'Statewide'"
          :totals="getCovidStateTotals"
        >
          {{ totalsStateNotification }}
        </covid-totals>
      </transition>

      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents"
          :title="'Countywide'"
          :totals="getCovidCountyTotals"
        >
          {{ totalsCountyNotification }}
        </covid-totals>
      </transition>
    </div>
    <!-- Covid Rankings header -->
    <div class="covid-ranking-title-layout">
      <transition name="fade">
        <div
          v-if="renderComponents"
          class="covid-ranking-title section-title-font"
        >
          {{ rankingTitle }}
        </div>
      </transition>
    </div>
    <!-- Covid Rankings -->
    <div class="covid-ranking-layout">
      <template v-for="(rankings, index) in getCovidRankings">
        <transition
          name="fade-slide-left"
          :key="index"
        >
          <covid-ranking
            v-if="renderComponents"
            :title="rankings.label"
            :items="rankings.data"
          />
        </transition>
      </template>
    </div>
    <!--  Covid Graph header -->
    <div class="covid-graph-title-layout">
      <transition name="fade">
        <div
          v-if="renderComponents"
          class="covid-graph-title section-title-font"
        >
          {{ graphTitle }}
        </div>
      </transition>
    </div>
    <!--  Covid Graph -->
    <transition name="fade">
      <div
        v-if="renderComponents"
        class="covid-graph-layout"
      >
        <covid-chart>
          {{ countryNotification }}
        </covid-chart>
      </div>
    </transition>

    <!-- <Footer /> -->
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Footer from './Footer.vue'
import CovidChart from './CovidChart.vue'
import CovidIntro from './CovidIntro.vue'
import CovidRanking from '@/shared/components/CovidRanking.vue'
import CovidTotals from '@/shared/components/CovidTotals.vue'
import { mapGetters } from 'vuex'
import axios, { AxiosResponse } from 'axios'
import { geolocationEP } from '@/shared/constants/geolocationEP'
import {
  CountryInfo,
  GeolocationResponse,
  GeolocationPosition
} from '@/types'

export default Vue.extend({
  name: 'CovidVis',

  components: {
    // Footer,
    CovidTotals,
    CovidRanking,
    CovidChart,
    CovidIntro
  },

  computed: {
    ...mapGetters([
      'getCovidRankings',
      'getSelectedState',
      'renderStateTotals',
      'getSelectedCounty',
      'renderCountyTotals',
      'getSelectedCountry',
      'getCovidStateTotals',
      'getAllAffectedStates',
      'getCovidGlobalTotals',
      'getCovidCountyTotals',
      'getCovidCountryTotals',
      'getAllAffectedCountries',
      'getStatesAffectedCounties'
    ]),
    totalsStateNotification: function(): string {
      return this.getSelectedCountry === 'USA'
        ? 'Select a state or allow location access.'
        : `State ${this.usaOnlyNotification}`
    },
    totalsCountyNotification: function(): string {
      return this.getSelectedCountry && this.getSelectedState
        ? 'Select a county or allow location access.'
        : (`County ${this.usaOnlyNotification} and a State has been selected.`).replace('.', '')
    }
  },

  data: () => ({
    geolocationCountry: '',
    renderComponents: false,
    usaOnlyNotification: 'data is only available if the country selected is USA.',
    totalsTitle: 'TOTALS',
    countryNotification: 'Select a country or allow location access.',
    rankingTitle: 'RANKINGS',
    graphTitle: 'GRAPH',
    initialDataScale: { name: 'Nationwide', value: 'nationwide' }
  }),
  /*
   * Created and Mount hook represent the Vuex store's entry point for initializing default state.
   */
  created() {
    this.$store.commit('setSelectedGraphType', { name: 'Line', value: 'line' })
    this.$store.commit('setSelectedResultType', { name: 'Total', value: 'total' })
    this.$store.commit('setSelectedRankingType', { name: 'Worldwide', value: 'worldwide' })
    this.$store.commit('setSelectedCovidDataType', [
      { name: 'Cases', value: 'cases' },
      { name: 'Recovered', value: 'recovered' },
      { name: 'Deaths', value: 'deaths' },
      { name: 'Vaccinated', value: 'vaccinated' }
    ])
    this.$store.commit('setSelectedDataScale', this.initialDataScale)
    this.$store.commit('addDataScale', this.initialDataScale)
    /*
     * Conditional rendering of components to allow for transitions.
     */
    setTimeout(() => { this.renderComponents = true }, 500)
  },

  async mounted() {
    await Promise.all([
      this.$store.dispatch('getCovidGlobalData'),
      this.$store.dispatch('getCovidCountryData')
    ])
    await Promise.all([
      this.$store.dispatch('getCovidVaccineGlobalData'),
      this.$store.dispatch('getCovidVaccineCountryData')
    ])
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
             that countries historical data if we don't already have it. */
          this.$store.dispatch('setCountryDependents', {
            name: this.geolocationCountry,
            value: this.geolocationCountry.toLowerCase()
          })
          await this.$store.dispatch('getHistoricalCountryData')

          /*
           * If the users geolocation is the United States, we also fetch the users state and county data
           * if we don't already have it. */
          if (this.geolocationCountry.toLowerCase() === 'usa') {
            const state = res.data.address.state
            const county = res.data.address.county?.replace(' County', '')

            if (this.getAllAffectedStates.length < 1) {
              await this.$store.dispatch('getCovidStateData')
              await this.$store.dispatch('getCovidVaccineStateData')
              this.$store.dispatch('setUsaStateDependents', { name: state, value: state.toLowerCase() })
            }

            if (this.getStatesAffectedCounties.length < 1) await this.$store.dispatch('getCovidCountyData')

            /*
             * Somtimes when pinging the geolocation API, county data is not available, we have this check
             * just in case. */
            if (county) this.$store.commit('setSelectedCounty', { name: county, value: county.toLowerCase() })
          }
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>

@import '../styles/main';

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
  padding: 70px 0 70px 0;
}
.covid-intro-layout {
  grid-row-start: 2;
  grid-row-end: 3;
}
.covid-totals-title-layout {
  /* parent grid */
  grid-row: 3 / 4;
}
.covid-totals-title {
  /* totals title grid */
  display: grid;
  justify-content: center;
  margin: 10px 0 10px 0;
}
.covid-totals-layout {
  /* parent grid */
  grid-row: 4 / 5;
  /* totals grid */
  display: grid;
  align-items: center;
  justify-content: center;
  grid-column-gap: 1rem;
  grid-template-columns: repeat(auto-fit, 300px);
  padding: 0 10% 0 10%;
  transition: 2s;
}
.covid-ranking-title-layout {
  /* parent grid */
  grid-row: 5 / 6;
}
.covid-ranking-title {
  display: grid;
  justify-content: center;
  margin: 10px 0 10px 0;
}
.covid-ranking-layout {
  /* parent grid */
  grid-row: 6 / 7;
  /* ranking grid */
  display: grid;
  align-items: center;
  justify-content: center;
  grid-column-gap: 1rem;
  grid-template-columns: repeat(auto-fit, 300px);
  padding: 0 10% 0 10%;
}
.covid-graph-title-layout {
  /* parent grid */
  grid-row: 7 / 8;
}
.covid-graph-title {
  display: grid;
  justify-content: center;
  margin: 10px 0 10px 0;
}
.covid-graph-layout {
  /* parent grid */
  grid-row: 8 / 9;
}
.covid-graph-notification-layout {
  /* parent grid */
  grid-row: 8 / 9;
  margin: auto;
}
</style>
