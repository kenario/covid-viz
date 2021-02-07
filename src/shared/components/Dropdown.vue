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
      class="dropdown-content"
      :style="{
        display: displayDropdown ? 'block' : 'none',
        backgroundColor: $vuetify.theme.themes.light.secondary
       }"
    >
      <input
        class="dropdown-search-bar mt-1 mb-1 ml-1 pa-1"
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
}
.dropdown-button:hover {
  cursor: pointer;
}
.dropdown-search-bar {
  width: calc(95% + 2px); // this is iffy
  height: 25px;
  background-color: white;
  border-radius: 2px 2px 2px 2px;
}
.dropdown-content {
  width: 100%;
  height: 300px;
  border-radius: 0px 0px 5px 5px;
  border-width: 1px;
  overflow-y: auto;
  position: relative;
  box-shadow: 1px 1px 3px;

}
.dropdown-item:hover {
  background-color: lightblue;
  cursor: pointer;
}
</style>
