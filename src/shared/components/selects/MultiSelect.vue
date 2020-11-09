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
      <label>{{ item }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'MultiSelect',

  props: {
    items: Array as () => string[],
    allItemsCheckedOnMount: Boolean
  },

  data: () => ({
    checkedItems: [] as string[]
  }),

  mounted() {
    if (this.allItemsCheckedOnMount) {
      this.checkedItems = this.items
      this.$emit('checkedItems', this.checkedItems)
    }
  },

  watch: {
    checkedItems: function(newItems: string[]) {
      this.$emit('checkedItems', newItems)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
