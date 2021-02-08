<template>
  <v-card>
    <v-list
      dense
      :color="$vuetify.theme.themes.light.primary"
    >
      <v-list-item
        two-line
        v-for="(label, l) in infoLabels"
        :key="l"
      >
        <v-list-item-content>
          <v-list-item-title
            :style="{ color: $vuetify.theme.themes.light.accent }"
          >
            {{ label | turnFirstLetterUppercase }}
          </v-list-item-title>

          <v-list-item-subtitle
            :style="{ color: $vuetify.theme.themes.light.secondary }"
          >
            <template
              v-if="label === 'updated'"
            >
              {{ moment(getCovidGeneralInfo[label]).format('MMMM Do YYYY, h:mm:ss a') }}
            </template>

            <template
              v-else
            >
              {{ getCovidGeneralInfo[label] }}
            </template>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default Vue.extend({

  name: 'CovidGeneralInfo',

  computed: {
    ...mapGetters([
      'getCovidGeneralInfo'
    ])
  },

  data: () => ({
    infoLabels: [] as string[]
  }),

  created() {
    this.infoLabels = Object.keys(this.getCovidGeneralInfo)
  },

  filters: {
    turnFirstLetterUppercase: (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)
  },

  methods: {
    moment: (time: number) => moment(time)
  }
})
</script>
