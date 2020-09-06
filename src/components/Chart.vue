<template>
  <div class="chart-container">
    <canvas id="chart" width="500" height="500"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Chart } from 'chart.js'
import { CovidLineChart } from '../types/CovidLineChart'

export default Vue.extend({
  name: 'Chart',

  props: {
    labels: Array as () => string[],
    data: Array as () => CovidLineChart[]
  },

  data: () => ({
    chart: {} as Chart
  }),

  mounted() {
    const ctx = document.getElementById('chart') as HTMLCanvasElement
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: '# of Votes',
          data: []
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })
  },

  watch: {
    // eslint-disable-next-line
    labels(newLabels: string[], oldLabels: string[]): void {
      /**
       * If labels prop changes, update the charts labels.
       */
      this.chart.data.labels = newLabels
      this.chart.update()
    },

    // eslint-disable-next-line
    data(newData: CovidLineChart[], oldData: CovidLineChart[]): void {

      /**
       * Add styling to the lines.
       */
      newData.forEach((data: CovidLineChart, index: number): void => {
        const lineColor: string = this.rgbGenerator()
        data.pointBackgroundColor = lineColor
        data.backgroundColor = lineColor
        data.fill = index
      })

      /**
       * If data props changes, update charts data
       */
      this.chart.data.datasets = newData
      this.chart.update()
    }
  },

  methods: {
    rgbGenerator: function(): string {
      return `rgba(${this.randomInteger(50, 200)},${this.randomInteger(50, 200)},${this.randomInteger(50, 200)},1)`
    },

    randomInteger: (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)
  }
})
</script>

<style lang="scss" scoped>

</style>
