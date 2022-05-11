<template>
  <section class="covid-header-container flex align-items-center">
    <header class="covid-header-title flex align-items-end ml-3">
      <h1 class="covid-header-title-part-one">
        {{ titlePartOne }}
      </h1>

      <h5 class="covid-header-title-part-two ml-1 mb-1">
        {{ titlePartTwo }}
      </h5>
    </header>

    <!-- <div
      class="covid-filters-button"
      @click="emitFilterButtonClick"
    >
      <span class="material-icons covid-filters-button-icon">
        filter_list
      </span>

      <span class="covid-filters-button-label secondary-header-font-style">
        {{ filterButtonName }}
      </span>
    </div> -->
  </section>
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

.covid-header-container {
  background-color: var(--surface-50);
  height: 70px;
}
.covid-header-title {
  font-size: 1.5rem;
}
.covid-header-title h1 {
  margin: 0;
}
.covid-header-title h5 {
  margin: 0;
}
.covid-header-title-part-one {
  color: var(--primary-color);
}
.covid-header-title-part-two {
  font-weight: 400;
}
// .covid-filters-button {
//   grid-column: 3 / 4;
//   font-size: 1.25rem;
//   border: 0.13rem solid white;
//   border-radius: 5px;
//   padding: 2px 0 4px 13px;
//   position: relative;
//   right: 20px;
// }
// .covid-filters-button:hover {
//   cursor: pointer;
//   background-color: #3d8aa7;
// }
// .covid-filters-button-icon {
//   color: white;
//   position: relative;
//   top: 3px;
// }
// /* styling used by both title part two and filter button */
// .secondary-header-font-style {
//   color: white;
//   font-family: 'Big Shoulders Display', cursive;
//   letter-spacing: 1px;
// }

// // Reduce filter button size and remove filter label in mobile view.
// @media only screen and (max-width: 768px) {
//   .covid-filters-button-label {
//     display: none;
//   }
//   .covid-header-container {
//     grid-template-columns: 260px auto 40px;
//   }
//   .covid-filters-button {
//     padding: 2px 5px 4px 5px;
//   }
// }
</style>
