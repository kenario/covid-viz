<template>
  <div class="chart-container">
    <canvas id="chart" width="500" height="500"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Chart, ChartConfiguration } from 'chart.js'
import { CovidLineChart, GraphType } from '../../types/'
import { randomInteger } from '../../shared/randomInteger'

export default Vue.extend({
  name: 'Chart',

  props: {
    data: Array as () => CovidLineChart[],
    labels: Array as () => string[],
    type: String
  },

  data: () => ({
    chart: {} as Chart
  }),

  mounted() {
    this.chart = this.createNewChart()
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
    },
    // eslint-disable-next-line
    type(newType: GraphType, oldType: GraphType): void {
      /**
       * Re-creates the chart into the new given type, updates with the current labels and data.
       */
      this.chart.destroy()
      this.chart = this.createNewChart()
      this.chart.data.labels = this.labels
      this.chart.data.datasets = this.data
      this.chart.update()
    }
  },

  methods: {
    rgbGenerator: function(): string {
      return `rgba(${randomInteger(50, 200)},${randomInteger(50, 200)},${randomInteger(50, 200)},1)`
    },

    createNewChart: function(): Chart {
      const ctx = document.getElementById('chart') as HTMLCanvasElement
      return new Chart(ctx, this.generateChartConfig())
    },

    generateChartConfig: function(): ChartConfiguration {
      return {
        type: this.type as GraphType,
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
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
