<template>
  <div
    class="dropdown-container pt-1 pb-1"
    v-click-outside="closeOpenedDropdown"
  >
    <div
      class="dropdown-label mt-1 mb-1"
      :style="{ color: $vuetify.theme.themes.light.accent }"
    >
      {{ label }}
    </div>

    <div
      class="dropdown-button"
      :style="{ borderColor: $vuetify.theme.themes.light.secondary }"
      @click="toggleDropdown"
    >
      <div
        class="dropdown-button-label pl-1 pt-1 pb-1"
        :style="{ color: $vuetify.theme.themes.light.secondary }"
      >
        {{ selectedItem }}
      </div>
    </div>

    <div
      class="dropdown-content pa-1"
      :style="{
        display: displayDropdown ? 'block' : 'none',
        backgroundColor: $vuetify.theme.themes.light.secondary,
        color: $vuetify.theme.themes.light.primary
      }"
    >
      <input
        class="dropdown-search-bar pa-1 mb-1"
        :style="{ color: $vuetify.theme.themes.light.primary }"
        v-if="hasSearch"
        v-model="searchText"
        :text="searchText"
      >

      <slot
        :searchText="searchText"
        :toggleDropdown="toggleDropdown"
        :clearSearchText="clearSearchText"
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
    displayDropdown: false,
    searchText: ''
  }),

  methods: {
    closeOpenedDropdown() {
      if (this.displayDropdown) {
        this.displayDropdown = false
      }
    },
    toggleDropdown() {
      this.displayDropdown = !this.displayDropdown
    },
    clearSearchText() {
      this.searchText = ''
    }
  }
})
</script>

<style lang="scss" scoped>
.dropdown-container {
  width: 250px;
  height: 60px;
}
.dropdown-button {
  border-style: solid;
  border-width: 1px;
  min-height: 26px;
}
.dropdown-button:hover {
  cursor: pointer;
}
.dropdown-search-bar {
  width: calc(99%); // this is iffy
  height: 25px;
  background-color: white;
  border-radius: 2px 2px 2px 2px;
}
/**
 * Mozilla firefox scrollbar, for all browsers, had to use rgb function since hex didn't seem to work.
 */
.dropdown-content {
  width: 100%;
  max-height: 300px;
  border-radius: 0px 0px 5px 5px;
  border-width: 1px;
  overflow-y: auto;
  position: relative;
  box-shadow: 3px 3px 3px;
  scrollbar-width: thin;
  scrollbar-color: #DA7F46 #CED5AE;
}
/**
 * All other browsers scrollbar.
 */
.dropdown-content::-webkit-scrollbar {
  width: 4px;
}
.dropdown-content::-webkit-scrollbar-track {
  background: #CED5AE;
  border-radius: 2px;
}
.dropdown-content::-webkit-scrollbar-thumb {
  background-color: rgb(218, 127, 70);
}
.dropdown-item:hover {
  background-color: lightblue;
  cursor: pointer;
}
</style>
