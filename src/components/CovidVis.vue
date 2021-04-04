<template>
  <div class="covid-vis-container">
    <div class="covid-intro-layout">
      <transition name="fade">
        <covid-intro v-if="renderComponents" />
      </transition>
    </div>

    <div class="covid-totals-title section-title-font">
      <transition name="fade">
        <div v-if="renderComponents">
          {{ totalsTitle }}
        </div>
      </transition>
    </div>

    <div class="covid-totals-layout">
      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents"
          :title="'Worldwide'"
          :totals="getCovidGlobalTotals"
        />
      </transition>
      <!-- We only render Nationwide totals if a country has been selected. -->
      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents"
          :title="'Nationwide'"
          :totals="getCovidCountryTotals"
        />
      </transition>
      <!-- We only render Statewide totals if the country selected is the United States -->
      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents"
          :title="'Statewide'"
          :totals="getCovidStateTotals"
        />
      </transition>
      <!-- We only render Countywide totals if a state has been selected -->
      <transition name="fade-slide-left">
        <covid-totals
          v-if="renderComponents"
          :title="'Countywide'"
          :totals="getCovidCountyTotals"
        />
      </transition>
    </div>

    <div class="covid-ranking-title-layout">
      <transition name="fade">
        <div
          v-if="renderComponents"
          class="covid-ranking-title section-title-font"
        >
          {{ rankingTitle }}
        </div>
      </transition>

      <transition name="fade">
        <div
          v-if="renderComponents"
          class="covid-ranking-subtitle standard-font"
        >
          {{ rankingSubtitle }}
        </div>
      </transition>
    </div>

    <div class="covid-country-ranking-layout">
      <transition name="fade-slide-left">
        <covid-ranking
          v-if="renderComponents"
          :title="'Worldwide Cases'"
          :items="getWorldwideCaseRankings"
        />
      </transition>

      <transition name="fade-slide-left">
        <covid-ranking
          v-if="renderComponents"
          :title="'Worldwide Deaths'"
          :items="getWorldwideDeathRankings"
        />
      </transition>

      <transition name="fade-slide-left">
        <covid-ranking
          v-if="renderComponents"
          :title="'Worldwide Tests'"
          :items="getWorldwideTestRankings"
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
    // CovidVisControls,
    // CovidChart,
    CovidIntro
  },

  computed: {
    ...mapGetters([
      'renderStateTotals',
      'renderCountyTotals',
      'getAllAffectedCountries',
      'getWorldwideCaseRankings',
      'getWorldwideDeathRankings',
      'getWorldwideTestRankings',
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
    renderComponents: false,
    totalsTitle: 'TOTALS',
    rankingTitle: 'RANKING',
    rankingSubtitle: 'All rankings are measured using "per one million" of a given population to have an accurate scaled comparison.'
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
}
.covid-intro-layout {
  grid-row-start: 2;
  grid-row-end: 3;
}
.covid-totals-title {
  /* parent grid */
  grid-row: 3 / 4;
  /* totals title grid */
  display: grid;
  justify-content: center;
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
.covid-ranking-subtitle {
  display: grid;
  justify-content: center;
  margin: 10px 0 10px 0;
}
.covid-country-ranking-layout {
  /* parent grid */
  grid-row: 6 / 7;
  /* ranking grid */
  display: grid;
  align-items: center;
  justify-content: center;
  grid-column-gap: 1rem;
  grid-template-columns: repeat(3, 300px);
}
</style>
