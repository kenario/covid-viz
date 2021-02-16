<template>
  <div>
    <transition name="fade-slide-down">
      <Header
        v-if="renderHeader"
        @filterButtonClick="toggleFilters"
      />
    </transition>

    <div
      class="covid-filter-layout"
      v-click-outside="closeOpenedFilters"
    >
      <transition name="slide-left">
        <covid-vis-controls v-if="showFilters" />
      </transition>
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
  },

  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters
    },

    /*
     * This function closes the filter if the click is outside the filter and is outside the filters
     * container.
     */
    closeOpenedFilters() {
      window.onclick = (e: MouseEvent): void => {
        const filterLeftBoundary = this.$el
          .getElementsByClassName('covid-filter-layout')[0]
          .getBoundingClientRect().left

        if (this.showFilters && e.pageX < filterLeftBoundary) {
          this.toggleFilters()
        }
      }
    }
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
.slide-left-enter-active, .slide-left-leave-active {
  transition: all 1s ease;
}
.slide-left-enter, .slide-left-leave-to {
  transform: translateX(300px);
}
.covid-filter-layout {
  position: fixed;
  height: 100vh;
  width: 300px;
  right: 0px;
}
</style>
