<template>
  <v-toolbar
    flat
    :color="$vuetify.theme.themes.light.primary"
  >
    <v-col>
      <v-toolbar-title>
        <span
          class="name-part-one text-h4 font-weight-bold"
          :style="{ color: $vuetify.theme.themes.light.accent }"
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
          class="pl-2 pr-3"
        >
          <span class="covid-header-filter-icon pb-1 mr-1">
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
/* Modifies vuetify button related styling */
.v-btn.v-size--large {
  color: white;
  font-family: 'Big Shoulders Display';
  font-size: 1.5rem;
  font-weight: 500;
}
.v-btn {
  text-transform: none;
  letter-spacing: 0;
}
</style>
