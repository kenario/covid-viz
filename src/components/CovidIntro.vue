<template>
  <div class="covid-intro-container">
    <div class="covid-intro-text standard-font">
      {{ intro }}
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend({

  name: 'CovidIntro',

  data: () => ({
    intro: `
      Welcome to CORONA Trends, a simple dashboard for tracking information related to the Novel
      Covid-19 virus or Coronavirus.  The data from this site is pulled from the disease.sh API,
      which aggregates data from multiple different sources around the world.  Granular data is
      available for the United States only. Vaccinated data is in doses, meaning it is counting
      the 1st and 2nd dose separately where applicable.
    `
  })

})
</script>

<style lang="scss" scoped>
@import '../styles/main';

.covid-intro-container {
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr minmax(60px, 80%) 1fr;
}
.covid-intro-text {
  grid-column-start: 2;
  grid-column-end: 3;
  color: $primary-color;
  line-height: 1.375rem;
}
</style>
