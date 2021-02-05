<template>
  <v-toolbar
    :color="$vuetify.theme.themes.light.primary"
  >
    <v-row
      :justify="'center'"
    >
      <div
        class="header-title text-h4 font-weight-light"
        :style="{ color: $vuetify.theme.themes.light.secondary }"
      >
        {{ headerName }}
      </div>
    </v-row>
  </v-toolbar>
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
