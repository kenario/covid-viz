<template>
  <v-toolbar
    flat
  >
    <v-col>
      <v-toolbar-title>
        <span
          class="name-part-one text-h4 font-weight-bold"
        >
          {{ namePartOne }}
        </span>

        <span class="name-part-two header-secondary-font">
          {{ namePartTwo }}
        </span>
      </v-toolbar-title>
    </v-col>

    <v-col>
      <v-row justify="end">
        <v-btn
          large
          outlined
          depressed
        >
          <span class="covid-header-filter-icon">
            <v-icon>
              mdi-filter-variant
            </v-icon>
          </span>

          <span>
            {{ filterButtonName }}
          </span>
        </v-btn>
      </v-row>
    </v-col>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Header',

  data: () => ({
    namePartOne: 'CORONA',
    namePartTwo: 'Trends',
    filterButtonName: 'Filters'
  })
})
</script>

<style lang="scss" scoped>
.name-part-one {
  display: inline-block;
  width: 136px;
}
.header-secondary-font {
  color: white;
  font-family: 'Big Shoulders Display';
  font-size: 1.5rem;
}
</style>
