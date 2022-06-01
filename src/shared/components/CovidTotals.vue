<template>
  <section class="cvd-totals-container w-15rem flex-column pt-1 pb-5 border-round-lg">
    <h3 class="cvd-totals-section-header flex justify-content-center">
      {{ title }}
    </h3>

    <div
      v-for="(v, k) in totals"
      :key="k"
    >
      <h3 class="cvd-totals-key flex justify-content-center font-semibold mb-2">
        {{ firstLetterUppercase(k) }}
      </h3>

      <div class="cvd-totals-value flex justify-content-center">
        {{ v === undefined ? 'Data unavailable' : v.toLocaleString() }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/* Presents covid data that has been summed for a given scale of data. */
import { PropType, toRefs } from 'vue'
import { CovidTotals } from '@/types/covid'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  totals: {
    type: Object as PropType<CovidTotals>,
    required: true
  }
})

const { totals } = toRefs(props)
const firstLetterUppercase = (w: string): string => w.charAt(0).toUpperCase() + w.slice(1)
</script>

<style lang="scss" scoped>
.cvd-totals-key {
  color: var(--orange-300);
}
</style>
