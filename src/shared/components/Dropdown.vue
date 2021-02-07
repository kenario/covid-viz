<template>
  <div class="dropdown-container pt-1 pb-1">
    <div
      class="dropdown-label mt-1 mb-1"
      :style="{ color: $vuetify.theme.themes.light.accent }"
    >
      {{ label }}
    </div>

    <div
      class="dropdown-button"
      @click="toggleDropdown"
    >
      <div
        class="dropdown-button-label"
        :style="{ color: $vuetify.theme.themes.light.secondary }"
      >
        {{ selectedItem }}
      </div>
    </div>

    <div
      class="dropdown-content"
      :style="displayDropdown ? 'display: block' : 'display: none'"
    >
      <input
        class="dropdown-input"
        v-if="hasSearch"
        v-model="selectedItem"
        :text="selectedItem"
      >

      <slot
        :searchText="selectedItem"
        :toggleDropdown="toggleDropdown"
      ></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Dropdown',

  props: {
    label: String,
    selectedItem: String,
    hasSearch: { type: Boolean, default: false }
  },

  data: () => ({
    displayDropdown: false
  }),

  methods: {
    toggleDropdown() {
      this.displayDropdown = !this.displayDropdown
    }
  }
})
</script>

<style lang="scss" scoped>
.dropdown-container {
  width: 250px;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1rem;
  height: 60px;
}
.dropdown-button {
  border-style: solid;
  border-width: 1px;
  border-color: gray;
}
.dropdown-button:hover {
  cursor: pointer;
}
.dropdown-input {
  width: calc(95% - 4px); // this is iffy
  margin: 5px 0px 5px 0px;
}
.dropdown-content {
  width: 100%;
  height: 300px;
  border-color: black;
  border-style: solid;
  border-width: 1px;
  overflow-y: auto;
}
.dropdown-item:hover {
  background-color: lightblue;
  cursor: pointer;
}
</style>
