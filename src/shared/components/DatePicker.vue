<template>
  <div class='date-picker-container'>
    <div class='date-picker-label'>
      {{ label }}:
    </div>

    <v-date-picker
      is-range
      :max-date="maxDate"
      v-model="dateRange"
      color="blue"
    />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import moment from 'moment'

export default Vue.extend({
  name: 'DatePicker',

  props: {
    label: String
  },

  data: () => ({
    dateRange: {} as { start: Date; end: Date },
    maxDate: {} as Date
  }),

  mounted() {
    /*
     * Initialize the date range and max date for the calendar. */
    const [end, start] = this.getDefaultDates(30)
    this.maxDate = end
    this.dateRange = {
      start: start,
      end: end
    }
  },

  methods: {
    getDefaultDates: (startDate: number): Date[] => [
      moment().utc().toDate(), // end date
      moment().utc().subtract(startDate, 'days').toDate() // start date
    ],
    /**
     * When two dates are selected, emit 'selectDate' event.
     */
    onDateSelect(selectedDates: Date[]): void {
      if (selectedDates.length === 2) {
        this.$emit('selectDate', selectedDates)
      }
    }
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
