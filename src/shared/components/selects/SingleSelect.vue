<template>
  <div class="single-select-container">
    <input
      class="single-select-search-bar"
      v-if="hasSearchBar"
      v-model="searchText"
      :text="searchText"
      :placeholder="searchbarPlaceholder"
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
    items: Array as () => SelectItem[] || Array as () => string[],
    hasSearchBar: { type: Boolean, default: false }
  },

  data: () => ({
    searchText: '',
    searchbarPlaceholder: 'Enter the name of a country...'
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

@import '../../../styles/main';

.single-select-container {
  background-color: $secondary-color;
  color: $primary-color;
  font-weight: 500;
  overflow-x: hidden;
}
.single-select-item {
  padding: 2px 0 1px 8px;
}
.single-select-item:hover {
  background-color: #cbd1a7;
  cursor: pointer;
}
.single-select-search-bar {
  width: calc(95%);
  height: 25px;
  background-color: $secondary-color;
  margin: 2px 0 4px 4px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid $primary-color;
}
/* placeholder css for all browsers */
::placeholder {
  color: $primary-color;
}
:-ms-input-placeholder {
  color: $primary-color;
}
::-ms-input-placeholder {
  color: $primary-color;
}
</style>
