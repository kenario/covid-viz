<template>
  <div id="covid-vis">
    <Header />
    <CovidGeneralInfo :info="getCovidGeneralInfo"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Header from './Header.vue'
import CovidGeneralInfo from './CovidGeneralInfo.vue'

export default Vue.extend({
  name: 'CovidVis',

  components: {
    Header,
    CovidGeneralInfo
  },

  computed: {
    ...mapGetters([
      'getCovidGeneralInfo',
      'getAllAffectedCountries'
    ])
  },

  mounted() {
    this.$store.dispatch('getCovidData')
    this.$store.dispatch('getCovidDataAllCountries')
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
