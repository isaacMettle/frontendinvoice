<template>
  <div>
    <apexchart type="donut" :options="chartOptions" :series="seriesvalue" />
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts
  },
  props: {
    seriesvalue: {
      type: Array,
      required: true
    },
    Chartcolor: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: "donut"
        },
        labels: ["Sales"], // you can adjust this as necessary
        colors: this.Chartcolor,
        legend: {
          position: 'bottom'
        },
        plotOptions: {
          pie: {
            donut: {
              size: '70%'
            }
          }
        }
      }
    };
  }
};
</script>

<style scoped>
/* Add any specific styling for your chart component here */
</style>
