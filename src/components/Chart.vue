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
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
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
      this.chart.data.datasets = newData
      this.chart.update()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
