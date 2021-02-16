<template>
  <div class='date-picker-container'>
    <div class='date-picker-label'>
      {{ label }}:
    </div>

    <input
      class='date-picker'
    >
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import moment from 'moment'
import flatpickr from 'flatpickr'
import '../../styles/customFlatpickr.scss'

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
      dateFormat: 'M d, Y',
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
</style>
