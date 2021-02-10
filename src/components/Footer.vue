<template>
  <v-footer
    absolute
    :color="$vuetify.theme.themes.light.secondary"
    :style="{ color: $vuetify.theme.themes.light.primary }"
  >
    <p>
      The Novel Coronavirus data is taken from the
    </p>
    <a
      :style="{ color: $vuetify.theme.themes.light.accent }"
      href="https://disease.sh/"
      target="_blank"
    >
      disease.sh
    </a>
    <p>
      API.
    </p>

    <p>
      The API collects the data from the following
    </p>
    <v-hover>
      organizations.
    </v-hover>
  </v-footer>
</template>

<script lang="ts">

import Vue from 'vue'

export default Vue.extend({

  name: 'Footer'
})
</script>

<style lang="scss" scoped>

</style>
