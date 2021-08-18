<template>
  <div class="multi-select-container">
    <div
      class="multi-select-item"
      v-for="(item, index) in items"
      :key="index"
    >
      <input
        type="checkbox"
        :value="item"
        :id="item.value"
        v-model="checkedItems"
      >
      <label
        class="multi-select-label"
        :for="item.value"
      >
        {{ item.name }}
      </label>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { SelectItem } from '@/types'

export default Vue.extend({
  name: 'MultiSelect',

  props: {
    items: Array as () => SelectItem[],
    selectedItems: Array as () => SelectItem[],
    allItemsCheckedOnMount: Boolean
  },

  data: () => ({
    checkedItems: [] as SelectItem[]
  }),

  mounted() {
    if (this.allItemsCheckedOnMount) this.checkedItems = this.selectedItems
  },

  watch: {
    checkedItems: function(newItems: SelectItem[]) {
      this.$emit('itemCheck', newItems)
    }
  }
})
</script>

<style lang="scss" scoped>

@import '../../../styles/main';

.multi-select-container {
  background-color: $secondary-color;
}
.multi-select-item {
  padding: 2px 0 2px 0;
}
.multi-select-label {
  color: $primary-color;
  font-weight: 500;
}
.multi-select-label:hover {
  cursor: pointer;
}
input:hover {
  cursor: pointer;
}
</style>
