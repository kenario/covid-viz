<template>
  <div id="covid-vis">
    <Header />
    <CovidGeneralInfo :info="getCovidGeneralInfo" />
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
      'getCovidGeneralInfo'
    ])
  },

  mounted() {
    this.$store.dispatch('getCovidData')
  }
})
</script>

<style scoped lang="scss">

</style>
