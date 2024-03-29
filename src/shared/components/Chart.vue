<template>
  <div class="chart-container">
    <canvas id="chart"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CovidLineChart } from '@/types/covid'
import { Chart, ChartConfiguration } from 'chart.js'
import { randomInteger } from '@/shared/randomInteger'

export default Vue.extend({
  name: 'Chart',

  props: {
    data: Array as () => CovidLineChart[],
    labels: Array as () => string[],
    type: String
  },

  data: () => ({
    chart: {} as Chart,
    lineColor: [] as string[]
  }),

  created() {
    /*
     * Initialize font styling. */
    Chart.defaults.global.defaultFontFamily = 'Roboto'
    Chart.defaults.global.defaultFontSize = 14
  },

  mounted() {
    /*
     * Generate colors for each unique data point in the data. */
    for (let x = 0; x < this.data.length; x++) {
      this.lineColor.push(this.rgbGenerator())
    }
    this.chart = this.createNewChart()
  },

  watch: {
    labels(newLabels: string[], oldLabels: string[]): void {
      /*
       * Check if there is any difference between the labels. */
      const hasChanged = newLabels.length !== oldLabels.length ||
        !newLabels.every((newLabel: string): boolean => oldLabels.includes(newLabel))

      if (hasChanged) {
        this.chart.data.labels = newLabels
        this.chart.update()
      }
    },
    data(newData: CovidLineChart[], oldData: CovidLineChart[]): void {
      /*
       * There is an edge case where a user unselects all of the data types (cases, recovered, etc.).
       * When the user first selects a data type after unselecting all data types, the chart is rendered
       * with only one lineColor due to only having one data type selected. When this happens we make sure
       * to push new lineColors until newData and lineColor has the same length. */
      if (newData.length > this.lineColor.length) {
        for (let x = 0; newData.length > this.lineColor.length; x++) {
          this.lineColor.push(this.rgbGenerator())
        }
      }
      /*
       * The following determines what has changed in data respective of the code:
       * 1. If the data types to be rendered have changed i.e. cases, recovered, etc.
       * 2. If the date range has changed.
       * 3. If the values in the data themselves have changed. */
      const hasChanged = newData.length !== oldData.length
        || newData[0].data.length !== oldData[0].data.length
        || newData[0].data.some(newD => !oldData[0].data.includes(newD))

      if (hasChanged) {
        this.generateChartStyling(newData)
        this.chart.data.datasets = newData
        this.chart.update()
      }
    },
    type(): void {
      /*
       * Re-creates the chart into the new given type, updates with the current labels and data. */
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
      this.generateChartStyling(this.data)
      const ctx = document.getElementById('chart') as HTMLCanvasElement
      return new Chart(ctx, this.generateChartConfig())
    },

    generateChartConfig: function(): ChartConfiguration {
      return {
        type: this.type,
        data: {
          labels: this.labels ? this.labels : [],
          datasets: this.data ? this.data : [{ label: 'No Data', data: [] }]
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      }
    },

    generateChartStyling: function(data: CovidLineChart[]): void {
      data.forEach((data: CovidLineChart, index: number): void => {
        data.pointBackgroundColor = this.lineColor[index]
        data.backgroundColor = this.lineColor[index]
        data.fill = index
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  margin: auto;
  height: 50vh;
  width: 90vw;
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
  border-color: lightgray;
}
</style>
