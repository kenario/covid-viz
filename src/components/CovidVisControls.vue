<template>
  <div class="covid-vis-controls-container">
    <DropdownFilter :items="getAllAffectedCountries" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import DropdownFilter from './DropdownFilter.vue'

export default Vue.extend({
  name: 'CovidVisControls',

  components: {
    DropdownFilter
  },

  computed: {
    ...mapGetters([
      'getAllAffectedCountries'
    ])
  }
})
</script>

<style lang="scss" scoped>
.covid-vis-controls-container {
  grid-column: 4 / 5;
  grid-row: 3 / 4;
}
</style>
