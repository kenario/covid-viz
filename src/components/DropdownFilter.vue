<template>
  <div class="dropdown-filter">
      <div class="dropdown-filter-label">
        Filter by country:
      </div>

      <input
        class="dropdown-input"
        v-model="country"
        @focus="displayDropdown = true"
        @blur="displayDropdown = false"
      >
      <div
        class="dropdown-content"
        v-if="displayDropdown"
      >
        <div
          class="dropdown-item"
          v-for="(item, index) in items"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DropdownFilter',

  props: {
    items: Array as () => string[]
  },

  data: () => ({
    country: '',
    displayDropdown: false
  })
})
</script>

<style lang="scss" scoped>
.dropdown-filter {
  height: 300px;
  width: 250px;
}
.dropdown-input {
  width: calc(100% - 4px); // this is iffy
}
/**
 * height and width need to not be reconfigured
 */
.dropdown-content {
  width: 100%;
  height: 100%;
  border-color: black;
  border-style: solid;
  border-width: 1px;
  overflow-y: scroll;
}
</style>
