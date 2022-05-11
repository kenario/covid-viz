<template>
  <div class="covid-header-container">
    <div class="covid-header-title">
      <span class="covid-header-title-part-one">
        {{ titlePartOne }}
      </span>

      <span class="covid-header-title-part-two secondary-header-font-style">
        {{ titlePartTwo }}
      </span>
    </div>

    <div
      class="covid-filters-button"
      @click="emitFilterButtonClick"
    >
      <span class="material-icons covid-filters-button-icon">
        filter_list
      </span>

      <span class="covid-filters-button-label secondary-header-font-style">
        {{ filterButtonName }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from "vue"

export default defineComponent({
  name: 'Header',

  data: () => ({
    titlePartOne: 'CORONA',
    titlePartTwo: 'TRENDS',
    filterButtonName: 'Filters',
    showFilters: false
  }),

  methods: {
    emitFilterButtonClick() {
      this.$emit('filterButtonClick')
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../styles/main';

.covid-header-container {
  background-color: $primary-color;
  height: 70px;
  display: grid;
  align-items: center;
  grid-template-columns: 260px auto 107px;
  position: fixed;
  width: 100%;
}
.covid-header-title {
  grid-column: 1 / 2;
  margin-left: 15px;
}
.covid-header-title-part-one {
  color: $accent-color;
  font-size: 2.25rem;
  font-weight: 600;
}
.covid-header-title-part-two {
  font-size: 1.60rem;
  font-weight: 400;
  position: relative;
  left: -7px;
  top: -4px;
}
.covid-filters-button {
  grid-column: 3 / 4;
  font-size: 1.25rem;
  border: 0.13rem solid white;
  border-radius: 5px;
  padding: 2px 0 4px 13px;
  position: relative;
  right: 20px;
}
.covid-filters-button:hover {
  cursor: pointer;
  background-color: #3d8aa7;
}
.covid-filters-button-icon {
  color: white;
  position: relative;
  top: 3px;
}
/* styling used by both title part two and filter button */
.secondary-header-font-style {
  color: white;
  font-family: 'Big Shoulders Display', cursive;
  letter-spacing: 1px;
}

// Reduce filter button size and remove filter label in mobile view.
@media only screen and (max-width: 768px) {
  .covid-filters-button-label {
    display: none;
  }
  .covid-header-container {
    grid-template-columns: 260px auto 40px;
  }
  .covid-filters-button {
    padding: 2px 5px 4px 5px;
  }
}
</style>
