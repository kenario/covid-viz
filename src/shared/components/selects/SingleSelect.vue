<template>
  <div
    class="single-select-container"
  >
    <div
      class="single-select-item"
      v-for="(item, index) in filteredItems"
      :key="index"
      @click="emitItemSelected(item)"
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
    searchText: { type: String, default: '' }
  },

  computed: {
    filteredItems() {
      return this.searchText.length > 0
        ? this.items.filter(i => i.value.toLowerCase().includes(this.searchText.toLowerCase()))
        : this.items
    }
  },

  methods: {
    emitItemSelected(item: string): void {
      this.$emit('selectedItem', item)
    }
  }
})
</script>

<style lang="scss" scoped>
  .single-select-item {
    padding-left: 2px;
  }
  .single-select-item:hover {
    cursor: pointer;
  }
</style>
