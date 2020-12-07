<template>
  <div id="covid-vis">
    <Header />
    <covid-general-info />
    <covid-vis-controls />
    <covid-chart />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Header from './Header.vue'
import CovidChart from './CovidChart.vue'
import CovidGeneralInfo from './CovidGeneralInfo.vue'
import CovidVisControls from './CovidVisControls.vue'
import { geolocationEP } from '../shared/constants/geolocationEP'

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

  created() {
    this.$store.commit('setSelectedGraphType', 'line')
    this.$store.commit('setSelectedResultType', 'total')
  },

  async mounted() {
    await this.$store.dispatch('getCovidDataAllCountries')
    this.$store.commit('setSelectedCountry', this.location)
    this.$store.commit('setSelectedCovidData')
    await this.$store.dispatch('getHistoricalCountryData')
    // this.locateUser()
  },

  methods: {
    locateUser(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position: GeolocationPosition): Promise<void> => {
          const res = await fetch(geolocationEP(position.coords.latitude, position.coords.longitude))
          const data = await res.json()
          this.$store.commit('setSelectedCountry', data.address.country_code)
        })
      }
    }
  }
})
</script>

<style scoped lang="scss">
#covid-vis {
  display: grid;
  grid-template-columns: 10px 1fr 10px 1fr 10px;
  grid-template-rows: 80px 10px 0.4fr 10px 1fr 10px;
  height: 100%;
}
</style>
