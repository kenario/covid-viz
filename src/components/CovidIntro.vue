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
      Covid-19 virus or Coronavirus.  You can filter the data using the button on the upper
      righthand corner.  You can also allow for your location to be used or stored as a cookie
      to populate the data. 
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
