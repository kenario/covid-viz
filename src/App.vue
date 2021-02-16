<template>
  <div>
    <transition name="fade-slide-down">
      <Header
        v-if="renderHeader"
        @filterButtonClick="showFilters = !showFilters"
      />
    </transition>

    <div class="covid-filter-layout">
      <covid-vis-controls v-if="showFilters" />
    </div>
    <covid-vis/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import CovidVis from './components/CovidVis.vue'
import CovidVisControls from './components/CovidVisControls.vue'
import Header from './components/Header.vue'

export default Vue.extend({
  name: 'App',

  components: {
    CovidVisControls,
    CovidVis,
    Header
  },

  data: () => ({
    renderHeader: false,
    showFilters: false
  }),

  created() {
    setTimeout(() => { this.renderHeader = true }, 100)
  }
})
</script>

<style lang="scss">

@import './styles/main';

body {
  background-color: $secondary-color;
  /* reset css */
  margin: 0 !important;
  padding: 0 !important;
}
/* declare global font */
html, body, html * {
  font-family: 'Roboto', sans-serif;
}
.fade-slide-down-enter-active, .fade-slide-down-leave-active {
  transition: all 1s ease;
}
.fade-slide-down-enter, .fade-slide-down-leave-to {
  transform: translateY(-70px);
  opacity: 0.5;
}
.covid-filter-layout {
  position: absolute;
  right: 0px;
}
</style>
