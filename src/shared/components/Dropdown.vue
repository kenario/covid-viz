<template>
  <div class="dropdown-container">
    <div class="dropdown-label">
      {{ label }}
    </div>

    <div
      class="dropdown-button"
      @click="toggleDropdown"
    >
      <div
        class="dropdown-button-label"
      >
        {{ selectedItem }}
      </div>
    </div>

    <div
      class="dropdown-content"
      :style="{
        display: displayDropdown ? 'block' : 'none',
      }"
    >
      <slot :toggleDropdown="toggleDropdown" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Dropdown',

  props: {
    label: String,
    selectedItem: String
  },

  data: () => ({
    displayDropdown: false
  }),

  methods: {
    closeOpenedDropdown() {
      if (this.displayDropdown) {
        this.displayDropdown = false
      }
    },
    toggleDropdown() {
      this.displayDropdown = !this.displayDropdown
    }
  }
})
</script>

<style lang="scss" scoped>

@import '../../styles/main';

.dropdown-container {
  max-width: 260px;
  height: 60px;
}
.dropdown-label {
  color: $accent-color;
  font-size: 1.25rem;
  font-weight: 600;
}
.dropdown-button {
  color: $secondary-color;
  border-bottom: 1px solid $secondary-color;
  min-height: 26px;
  margin-top: 5px;
}
.dropdown-button:hover {
  cursor: pointer;
}
.dropdown-content {
  width: 100%;
  max-height: 300px;
  border-radius: 0px 0px 5px 5px;
  border-width: 1px;
  overflow-y: auto;
  position: relative;
  box-shadow: 1px 1px 5px;
  /*
   * Mozilla firefox scrollbar.
   */
  scrollbar-width: thin;
  scrollbar-color: $accent-color $secondary-color;
}
/*
 * All other browsers scrollbar.
 */
.dropdown-content::-webkit-scrollbar {
  width: 4px;
}
.dropdown-content::-webkit-scrollbar-track {
  background: $secondary-color;
  border-radius: 2px;
}
.dropdown-content::-webkit-scrollbar-thumb {
  background-color: $accent-color;
}
</style>
