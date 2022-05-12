<template>
  <div>
    <Header
      @filtersButtonClick="showFilters = !showFilters"
    />

    <SideBar
      v-model:visible="showFilters"
      class="p-sidebar-sm"
      position="right"
    />

    <!-- <div
      v-if="getHasError"
      class="covid-vis-error"
    >
      <error-modal @closeErrorModal="onCloseErrorModal" />
    </div> -->

    <!-- <covid-vis/> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from './components/Header.vue'
// import CovidVis from './components/CovidVis.vue'
// import CovidVisControls from './components/CovidVisControls.vue'
// import ErrorModal from './shared/components/ErrorModal.vue'
// import { mapGetters } from 'vuex'

const showFilters = ref(false)
</script>

<style lang="scss">

body {
  /* reset css */
  margin: 0 !important;
  padding: 0 !important;
  /* global primevue styling */
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--surface-0);
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--text-color);
}
// .section-title-font {
//   font-weight: 600;
//   font-size: 3rem;
// }
// .section-subtitle-font {
//   font-size: 1.75rem;
//   font-weight: 600;
// }
// .standard-font {
//   font-weight: 500;
//   font-size: 1.25rem;
// }
// .info-font {
//   font-weight: 500;
//   font-size: 1.5rem;
// }
// .label-font {
//   font-weight: 600;
//   font-size: 1.25rem;
// }
// .notification-font {
//   font-weight: 500;
//   font-size: 1.25rem;
// }
// .covid-vis-error {
//   position: fixed;
//   top: 50%;
//   left: 45%;
// }

</style>
