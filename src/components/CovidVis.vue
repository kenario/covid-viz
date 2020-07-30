<template>
  <div id="covid-vis">
    <Header />

    <div class="covid-vis-general">
      <div class="covid-vis-country">
        Country: {{ getCovidData['country'] }}
      </div>

      <div class="covid-vis-cases">
        Cases: {{ getCovidData['cases'] }}
      </div>

      <div class="covid-vis-deaths">
        Deaths: {{ getCovidData['deaths'] }}
      </div>

      <div class="covid-vis-recovered">
        Recovered: {{ getCovidData['recovered'] }}
      </div>

      <div class="covid-vis-tests">
        Tests: {{ getCovidData['tests'] }}
      </div>

      <div class="covid-vis-last-updated">
        Last Updated: {{ moment(getCovidData['updated']) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from './Header.vue'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default Vue.extend({
  name: 'CovidVis',

  components: {
    Header
  },

  computed: {
    ...mapGetters([
      'getCovidData'
    ])
  },

  mounted() {
    this.$store.dispatch('getCovidData')
    console.log(this.getCovidData)
  },

  methods: {
    moment: (time: number) => moment(time)
  }
})
</script>

<style scoped lang="scss">

</style>
