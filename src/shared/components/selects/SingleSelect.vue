<template>
  <div
    class="single-select-container"
  >
    <input
      class="dropdown-search-bar"
      v-if="hasSearchBar"
      v-model="searchText"
      :text="searchText"
    >

    <div
      class="single-select-item"
      v-for="(item, index) in filteredItems"
      :key="index"
      @click="emitItemSelected(item); clearSearchText()"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { SelectItem } from '../../../types'

export default Vue.extend({
  name: 'SingleSelect',

  props: {
    items: Array as () => SelectItem[],
    hasSearchBar: { type: Boolean, default: false }
  },

  data: () => ({
    searchText: ''
  }),

  computed: {
    /**
     * If we have a search bar, we filter the items to those that match the search text.
     */
    filteredItems() {
      return this.hasSearchBar
        ? this.items.filter(i => i.value.toLowerCase().includes(this.searchText.toLowerCase()))
        : this.items
    }
  },

  methods: {
    emitItemSelected(item: string): void {
      this.$emit('selectedItem', item)
    },
    clearSearchText() {
      this.searchText = ''
    }
  }
})
</script>

<style lang="scss" scoped>
.single-select-item {
  padding-left: 2px;
}
.single-select-item:hover {
  background-color: #e3e9c8;
  cursor: pointer;
}
.dropdown-search-bar {
  width: calc(99% + 3px); // this is iffy
  height: 25px;
  background-color: white;
  border-radius: 2px 2px 2px 2px;
}
</style>
