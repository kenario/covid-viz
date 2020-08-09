<template>
  <div class="covid-vis-controls-container">
    <DropdownFilter
      :label="'Country'"
      :items="getAllAffectedCountries"
      @selectItem="setSelectedCountry"
    />
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
  },

  methods: {
    setSelectedCountry: function(country: string): void {
      this.$store.commit('setSelectedCovidData', country)
    }
  }
})
</script>

<style lang="scss" scoped>
.covid-vis-controls-container {
  grid-column: 4 / 5;
  grid-row: 3 / 4;
}
</style>
