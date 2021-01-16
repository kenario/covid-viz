<template>
  <div class='date-picker-container'>
    <div class='date-picker-label'>
      {{ label }}:
    </div>

    <input class='date-picker'>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import moment from 'moment'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'

export default Vue.extend({
  name: 'DatePicker',

  props: {
    label: String
  },

  data: () => ({
    datePicker: {} as flatpickr.Instance
  }),

  mounted() {
    /**
     * Initialize date picker variable on the input element.
     */
    this.datePicker = flatpickr(this.$el.childNodes[this.$el.childNodes.length - 1], {
      dateFormat: 'F j, Y',
      mode: 'range',
      disable: [
        (date): boolean => moment.utc(date).isAfter(moment.utc())
      ],
      defaultDate: this.getDefaultDates(30)
    })
    /**
     * Adds function to execute when a change happens.
     */
    this.datePicker.config.onChange.push(this.onDateSelect)
  },

  methods: {
    getDefaultDates: (startDate: number): Date[] => [
      moment().utc().toDate(),
      moment().utc().subtract(startDate, 'days').toDate()
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
.date-picker-container {
    width: 250px;
}
.date-picker {
  width: calc(100% - 4px);
}
</style>
