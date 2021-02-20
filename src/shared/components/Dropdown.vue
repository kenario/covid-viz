<template>
  <div
    class="dropdown-container"
    v-click-outside="closeOpenedDropdown"
  >
    <div class="dropdown-label">
      {{ label }}
    </div>

    <div
      class="dropdown-button"
      @click="toggleDropdown"
    >
      <div class="dropdown-button-label">
        <template v-if="selectedItem.length > 0">
          {{ selectedItem }}
        </template>

        <template v-else>
          <div class="dropdown-button-label-placeholder">
            Please select {{ label }}...
          </div>
        </template>
      </div>
    </div>

    <transition name="fade-slide-down">
      <div
        class="dropdown-content"
        v-if="displayDropdown"
      >
        <slot :toggleDropdown="toggleDropdown" />
      </div>
    </transition>
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
.dropdown-button-label-placeholder {
  font-style: italic;
  font-size: 0.9rem;
  color: #cccfba;
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
/* Transitions */
.fade-slide-down-enter-active, .fade-slide-down-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-down-enter, .fade-slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
