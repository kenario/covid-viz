<template>
  <div class="dropdown-filter-container">
    <div class="dropdown-filter-label">
      {{ label }}:
    </div>

    <input
      class="dropdown-input"
      v-model="selectedItem"
      :text="selectedItem"
      @focus="displayDropdown = true"
    >
    <div
      class="dropdown-content"
      :style="displayDropdown ? 'display: block' : 'display: none'"
    >
      <div
        class="dropdown-item"
        v-for="(item, index) in items.filter(i => i.toLowerCase().includes(selectedItem.toLowerCase()))"
        :key="index"
        @click="onItemClick(item)"
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
    label: String,
    defaultItem: String,
    items: Array as () => string[]
  },

  data: () => ({
    selectedItem: '',
    displayDropdown: false
  }),

  mounted() {
    this.selectedItem = this.defaultItem
  },

  methods: {
    onItemClick(item?: string): void {
      if (item) {
        this.selectedItem = item
        this.$emit('selectItem', item)
      } else if (this.items.includes(this.selectedItem)) {
        this.$emit('selectItem', this.selectedItem)
      }

      this.displayDropdown = false
    }
  }
})
</script>

<style lang="scss" scoped>
.dropdown-filter-container {
  width: 250px;
}
.dropdown-input {
  width: calc(100% - 4px); // this is iffy
}
.dropdown-content {
  width: 100%;
  height: 300px;
  border-color: black;
  border-style: solid;
  border-width: 1px;
  overflow-y: scroll;
}
.dropdown-item:hover {
  background-color: lightblue;
  cursor: pointer;
}
</style>
