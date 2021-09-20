<template>
  <div>
    <transition name="fade-slide-down">
      <Header
        v-if="renderHeader"
        @filterButtonClick="toggleFilters"
      />
    </transition>

    <transition name="slide-left">
      <div
        v-if="showFilters"
        class="covid-filter-layout"
        :class="{
          'covid-filter-layout--z-index': showFilters === true,
          'covid-filter-layout--z-index-slow': showFilters === false
        }"
      >
          <covid-vis-controls
            @closeButtonClick="toggleFilters"
            v-click-outside="closeOpenedFilters"
          />
      </div>
    </transition>

    <div
      v-if="getHasError"
      class="covid-vis-error"
    >
      <error-modal @closeErrorModal="onCloseErrorModal" />
    </div>

    <covid-vis/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import CovidVis from './components/CovidVis.vue'
import CovidVisControls from './components/CovidVisControls.vue'
import ErrorModal from './shared/components/ErrorModal.vue'
import Header from './components/Header.vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'App',

  components: {
    CovidVisControls,
    ErrorModal,
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

  computed: {
    ...mapGetters([
      'getHasError'
    ])
  },

  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters
    },

    onCloseErrorModal() {
      this.$store.commit('setHasError', false)
    },

    /*
     * This function closes the filter if the click is outside the filter and the filters
     * container.  The purpose for this is to make sure the Filter button is included as an element
     * that is not outside the filters v-outside-click functionality. We also only toggle
     * close if the filter is open.
     */
    closeOpenedFilters() {
      window.onclick = (e: MouseEvent): void => {
        const filterLeftBoundary = this.$el
          .getElementsByClassName('covid-vis-container')[0]
          ?.getBoundingClientRect().right - 300

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
.fade-enter-active, .fade-leave-active {
  transition: all 1.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.covid-filter-layout {
  background-color: $primary-color;
  position: fixed;
  height: 100%;
  width: 300px;
  right: 0px;
  overflow: auto;
  top: 70px;

  &--z-index {
    z-index: 1;
  }

  &--z-index-slow {
    transition: z-index 2s;
    z-index: 0;
  }
}
.section-title-font {
  color: $primary-color;
  font-weight: 600;
  font-size: 3rem;
}
.section-subtitle-font {
  color: $primary-color;
  font-size: 1.75rem;
  font-weight: 600;
}
.standard-font {
  color: $primary-color;
  font-weight: 500;
  font-size: 1.25rem;
}
.info-font {
  color: $primary-color;
  font-weight: 500;
  font-size: 1.5rem;
}
.label-font {
  color: $accent-color;
  font-weight: 600;
  font-size: 1.25rem;
}
.notification-font {
  color: $accent-color;
  font-weight: 500;
  font-size: 1.25rem;
}
.covid-vis-error {
  position: fixed;
  top: 50%;
  left: 45%;
}

</style>
