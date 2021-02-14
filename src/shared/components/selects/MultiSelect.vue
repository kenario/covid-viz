<template>
  <div class="multi-select-container">
    <div
      class="multi-select-item"
      v-for="(item, index) in items"
      :key="index"
    >
      <v-checkbox
        dense
        v-model="checkedItems"
        :value="item.value"
        @click="itemCheck"
      >
        <template v-slot:label>
          <label class="multi-select-label">
            {{ item.name }}
          </label>
        </template>
      </v-checkbox>
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
    checkedItems: [] as string[]
  }),

  mounted() {
    if (this.allItemsCheckedOnMount) {
      this.checkedItems = this.items.map((item: SelectItem): string => item.value)
      this.itemCheck()
    }
  },

  methods: {
    itemCheck: function() {
      this.$emit('itemCheck', this.items.filter((item: SelectItem): boolean => this.checkedItems.includes(item.value)))
    }
  }
})
</script>

<style lang="scss" scoped>
.multi-select-label {
  color: #184F63;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1rem;
}
.multi-select-label:hover {
  cursor: pointer;
}
</style>
