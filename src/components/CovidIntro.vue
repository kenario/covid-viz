<template>
  <h3 class="m-2">
    {{ intro }}   
  </h3>
</template>

<script setup lang="ts">
import Vue from 'vue'

const intro = `
  Welcome to CORONA Trends, a simple dashboard for tracking information related to the Novel
  Covid-19 virus or Coronavirus.  The data from this site is pulled from the disease.sh API,
  which aggregates data from multiple different sources around the world.  Granular data is
  available for the United States only. Vaccinated data is in doses, meaning it is counting
  the 1st and 2nd dose separately where applicable.
`
// export default Vue.extend({

//   name: 'CovidIntro',

//   data: () => ({
//     intro: `
//       Welcome to CORONA Trends, a simple dashboard for tracking information related to the Novel
//       Covid-19 virus or Coronavirus.  The data from this site is pulled from the disease.sh API,
//       which aggregates data from multiple different sources around the world.  Granular data is
//       available for the United States only. Vaccinated data is in doses, meaning it is counting
//       the 1st and 2nd dose separately where applicable.
//     `
//   })

// })
</script>

<style lang="scss" scoped>
</style>
