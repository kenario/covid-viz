<template>
  <section>
    <h1 class="cvd-totals-section-header">
      {{ title }}
    </h1>

    <div v-if="totals > 0">
      <div
        v-for="(t, i) in totalsKeyValue"
        :key="i"
      >
        <!-- {{ firstLetterUppercase(l) }} -->
        {{ firstLetterUppercase(t[0]) }}

        {{ t[1]?.toLocaleString() }}
        <!-- {{ totals[l].toLocaleString('en-US') }} -->
      </div>
    </div>
  </section>
  <!-- <div class="covid-totals-container">
    <div class="covid-totals-title section-subtitle-font">
      {{ title }}
    </div>

    <div
      v-if="isTotalsPopulated"
      class="covid-totals-list"
    >
      <div
        class="covid-total"
        v-for="(label, l) in keys"
        :key="l"
      >
        <div
          v-if="totals[label]"
          class="covid-total-item"
        >
          <div class="covid-totals-label label-font">
            {{ label | turnFirstLetterUppercase }}
          </div>

          <div class="covid-totals-value standard-font">
            {{ totals[label].toLocaleString('en-US') }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="covid-totals-notification notification-font"
    >
      <slot>
        {{ defaultNotification }}
      </slot>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { CovidTotals } from '@/types/covid'
import { computed } from '@vue/reactivity'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  totals: {
    type: {} as () => CovidTotals,
    required: true
  }
})

const defaultNotification = 'Data unavailable'

const totalsKeyValue = computed((): [string, string | number][] | undefined => Object.entries(props.totals))
// const keys = computed((): string[] | undefined => Object.keys(props.totals))
// const values = computed((): string[] | undefined => Object.values(props.totals))
const firstLetterUppercase = (w: string): string => w.charAt(0).toUpperCase() + w.slice(1)

const moment_ = (t: number) => moment(t)
</script>

<style lang="scss" scoped>
</style>
