<template>
  <div class='date-picker-container'>
    <div
      class='date-picker-label mt-1 mb-1'
      :style="{ color: $vuetify.theme.themes.light.accent }"
    >
      {{ label }}:
    </div>

    <input
      class='date-picker pl-1 pt-1 pb-1'
      :style="{ borderColor: $vuetify.theme.themes.light.secondary }"
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
  width: 100%;
  border-style: solid;
  border-width: 1px;
  min-height: 26px;
  color: #CED5AE;
}
.date-picker:hover {
  cursor: pointer;
}
</style>
