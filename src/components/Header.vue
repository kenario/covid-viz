<template>
  <v-toolbar
    :color="$vuetify.theme.themes.light.primary"
    :justify="'center'"
  >
    <v-col>
      <v-toolbar-title>
        <span
          class="name-part-one text-h4 font-weight-bold"
          :style="{ color: $vuetify.theme.themes.light.accent }"
        >
          {{ namePartOne }}
        </span>

        <span class="name-part-two">
          {{ namePartTwo }}
        </span>
      </v-toolbar-title>
    </v-col>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Header',

  data: () => ({
    namePartOne: 'CORONA',
    namePartTwo: 'Trends'
  })
})
</script>

<style lang="scss" scoped>
.name-part-one {
  display: inline-block;
  width: 136px;
}
.name-part-two {
  color: white;
  font-family: 'Big Shoulders Display';
  font-size: 1.5rem;
}
</style>
