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
    <CovidVis />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from './components/Header.vue'
import CovidVis from './components/CovidVis.vue'
// import CovidVisControls from './components/CovidVisControls.vue'
// import ErrorModal from './shared/components/ErrorModal.vue'

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
</style>
