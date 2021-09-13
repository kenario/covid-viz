<template>
  <div class="covid-ranking-container">
    <div class="covid-ranking-title section-subtitle-font">
      {{ title }}
    </div>

    <div
      v-for="(item, index) in items"
      class="covid-ranking-item standard-font"
      :key="index"
    >
      <div class="covid-ranking-label label-font">
        {{ index + 1 }}. {{ item.name }}
      </div>

      <div class="covid-ranking-total">
        {{ item.total && item.total.toLocaleString('en-US') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { CovidRankingData } from '../../types/covid/CovidRankingData'

export default Vue.extend({
  name: 'CovidRanking',

  props: {
    title: String,
    items: Array as () => CovidRankingData[]
  }

})
</script>

<style lang="scss" scoped>
.covid-ranking-container {
  padding-bottom: 30px;
}
.covid-ranking-item {
  margin: 10px 0 10px 10px;
}
.covid-ranking-total {
  margin-left: 23px;
}
</style>
