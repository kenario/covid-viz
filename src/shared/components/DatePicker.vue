<template>
  <div class='date-picker-container'>
    <div class='date-picker-label'>
      {{ label }}
    </div>

    <v-date-picker
      is-range
      color="blue"
      v-model="dateRange"
      :max-date="maxDate"
    />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import moment from 'moment'
import { DateRange } from '../../types/DateRange'

export default Vue.extend({
  name: 'DatePicker',

  props: {
    label: String,
    selectedDates: Object as () => DateRange
  },

  data: () => ({
    dateRange: {} as { start: Date; end: Date },
    maxDate: {} as Date
  }),

  watch: {
    dateRange(newDateRange, oldDateRange) {
      const newDateStart = moment.utc(newDateRange.start)
      const newDateEnd = moment.utc(newDateRange.end)
      const oldDateStart = moment.utc(oldDateRange.start)
      const oldDateEnd = moment.utc(oldDateRange.end)

      if (!newDateStart.isSame(oldDateStart, 'day') || !newDateEnd.isSame(oldDateEnd, 'day')) {
        if (Object.keys(oldDateRange).length !== 0) {
          this.$emit('selectDate', { startDate: this.dateRange.start, endDate: this.dateRange.end })
        }
      }
    }
  },

  mounted() {
    /*
     * Since the date picker gets remounted when the filter is opened, we check if there was a
     * previously recorded state and use that instead.  Otherwise the default dates are used. */
    if (Object.keys(this.selectedDates).length > 0) {
      this.dateRange = {
        start: this.selectedDates.startDate,
        end: this.selectedDates.endDate
      }
    } else {
      const [end, start] = this.getDefaultDates(30)
      this.maxDate = end
      this.dateRange = {
        start: start,
        end: end
      }
    }
  },

  methods: {
    getDefaultDates: (startDate: number): Date[] => [
      moment().utc().toDate(), // end date
      moment().utc().subtract(startDate, 'days').toDate() // start date
    ]
  }
})
</script>

<style lang='scss' scoped>

@import '../../styles/main';

.date-picker-container {
  max-width: 260px;
}
.date-picker-label {
  color: $accent-color;
  font-weight: 600;
  font-size: 1.25rem;
}
.date-picker {
  width: 100%;
  border-style: solid;
  border-width: 1px;
  min-height: 26px;
  margin-top: 5px;
  color: $secondary-color;
  background-color: $primary-color;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid $secondary-color;
  font-size: 1rem;
}
.date-picker:hover {
  cursor: pointer;
}

// all styling underneath are modifying the v-calendar component
.vc-container {
  background-color: $secondary-color;
}
</style>
