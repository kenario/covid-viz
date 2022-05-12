<template>
  <section class="covid-header-container flex justify-content-between align-items-center">
    <header class="covid-header-title flex align-items-end ml-3">
      <h1 class="covid-header-title-part-one">
        {{ titlePartOne }}
      </h1>

      <h5 class="covid-header-title-part-two ml-1 mb-1">
        {{ titlePartTwo }}
      </h5>
    </header>

    <Button 
      class="p-button-text mr-3"
      :label="filtersButtonName"
      icon="pi pi-filter"
      iconPos="left"
      @click="emitFiltersButtonClick"
    />
  </section>
</template>

<script setup lang="ts">
const titlePartOne = 'CORONA'
const titlePartTwo = 'TRENDS'
const filtersButtonName = 'Filters'

const emit = defineEmits(['filtersButtonClick'])

const emitFiltersButtonClick = () => {
  emit('filtersButtonClick')
}
</script>

<style lang="scss" scoped>
.covid-header-container {
  background-color: var(--surface-50);
  height: 70px;
}
.covid-header-title {
  font-size: 1.5rem;
}
.covid-header-title h1 {
  margin: 0;
}
.covid-header-title h5 {
  margin: 0;
}
.covid-header-title-part-one {
  color: var(--primary-color);
}
.covid-header-title-part-two {
  font-weight: 400;
}
</style>
