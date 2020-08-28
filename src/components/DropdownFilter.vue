<template>
  <div class="dropdown-filter">
    <div class="dropdown-filter-label">
      {{ label }}:
    </div>

    <input
      class="dropdown-input"
      v-model="item"
      :text="item"
      @focus="displayDropdown = true"
    >
    <div
      class="dropdown-content"
      v-if="displayDropdown"
    >
      <div
        class="dropdown-item"
        v-for="(item, index) in items.filter(i => i.toLowerCase().includes(item.toLowerCase()))"
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
    items: Array as () => string[]
  },

  data: () => ({
    item: '',
    displayDropdown: false
  }),

  methods: {
    onItemClick(item?: string): void {
      if (item) {
        this.$emit('selectItem', item)
      } else if (this.items.includes(this.item)) {
        this.$emit('selectItem', this.item)
      }

      this.displayDropdown = false
    }
  }
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
.dropdown-content {
  width: 100%;
  height: 100%;
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
