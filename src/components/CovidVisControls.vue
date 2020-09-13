<template>
  <div class="covid-vis-controls-container">
    <dropdown-filter
      :label="'Country'"
      :items="getAllAffectedCountries"
      :defaultItem="getSelectedCountry"
      @selectItem="setSelectedCountry"
    />

    <date-picker
      :label="'Dates'"
      @selectDate="test"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import DropdownFilter from './DropdownFilter.vue'
import DatePicker from './DatePicker.vue'

export default Vue.extend({
  name: 'CovidVisControls',

  components: {
    DropdownFilter,
    DatePicker
  },

  computed: {
    ...mapGetters([
      'getSelectedCountry',
      'getAllAffectedCountries'
    ])
  },

  methods: {
    setSelectedCountry: async function(country: string): Promise<void> {
      this.$store.commit('setSelectedCountry', country)
      this.$store.commit('setSelectedCovidData')
      await this.$store.dispatch('getHistoricalCountryData')
    },

    test(event: Event): void {
      console.log(event)
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
