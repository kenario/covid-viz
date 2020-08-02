<template>
  <div id="covid-vis-header">
    <div class="header-name">
      {{ headerName }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Header',

  data: () => ({
    headerName: 'Covid Visualization'
  })
})
</script>

<style scoped lang="scss">
#covid-vis-header {
  background-color: black;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 1 / 6;
  grid-row: 0 / 1;
}
.header-name {
  color: white;
  font-size: 28px;
}
</style>
