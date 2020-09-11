<template>
  <div class="date-picker-container">
    <div id="date-picker">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import flatpickr from 'flatpickr'

export default Vue.extend({
  name: 'Date Picker',

  created() {
    flatpickr('#date-picker', {})
  }
})
</script>

<style lang="scss" scoped>

</style>
