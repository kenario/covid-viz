<template>
  <div class="multi-select-container">
    <div
      class="multi-select-item"
      v-for="(item, index) in items"
      :key="index"
    >
      <input
        :value="item"
        type="checkbox"
        v-model="checkedItems"
      >
      <label>{{ item.name }}</label>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { SelectItem } from '../../../types'

export default Vue.extend({
  name: 'MultiSelect',

  props: {
    items: Array as () => SelectItem[],
    allItemsCheckedOnMount: Boolean
  },

  data: () => ({
    checkedItems: [] as SelectItem[]
  }),

  mounted() {
    if (this.allItemsCheckedOnMount) this.checkedItems = this.items
  },

  watch: {
    checkedItems: function(newItems: SelectItem[]) {
      this.$emit('checkedItems', newItems)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
