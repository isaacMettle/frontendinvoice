<template>
  <Layout>
    <PageHeader title="Les Statistiques" pageTitle="Statistiques" />
    <BCard no-body>
      <BCardBody class="pb-0">
        <div class="clearfix">
          <div class="float-end">
            <div class="input-group input-group-sm">
              <input type="date" v-model="startDate" class="form-control form-control-sm" />
              <input type="date" v-model="endDate" class="form-control form-control-sm" />
              <button class="btn btn-primary btn-sm" @click="fetchProductSales">Fetch</button>
            </div>
          </div>
          <BCardTitle class="mb-4">Top Selling Products</BCardTitle>
        </div>
        <div v-for="(data, index) of products" :key="index">
          <div class="text-muted text-center">
            <p class="mb-2">{{ data.name }}</p>
            <h4>{{ data.total_revenue }}</h4>
            <p class="mt-4 mb-0">
              <span class="badge badge-soft-success font-size-11 me-2">
                {{ data.total_sales }} sales
              </span>
              From previous period
            </p>
          </div>
          <div class="table-responsive mt-4">
            <BTableSimple class="align-middle mb-0">
              <BTbody>
                <BTr>
                  <BTd>
                    <h5 class="font-size-14 mb-1">{{ data.name }}</h5>
                  </BTd>
                  <BTd>
                    <Sellingchart :seriesvalue="[data.total_sales]" :Chartcolor="[data.color]" />
                  </BTd>
                  <BTd>
                    <p class="text-muted mb-1">Sales</p>
                    <h5 class="mb-0">{{ data.total_sales }} units</h5>
                  </BTd>
                </BTr>
              </BTbody>
            </BTableSimple>
          </div>
        </div>
      </BCardBody>
    </BCard>
  </Layout>
</template>

<script>
import Sellingchart from "./sellingchart"; // Adjust the path if necessary
import axios from 'axios';
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

export default {
  components: {
    Sellingchart,
    Layout,
    PageHeader,
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      products: [],
      defaultColors: ['#FF5733', '#33FF57', '#3357FF', '#F333FF'], // Define default colors here
    };
  },
  methods: {
    async fetchProductSales() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/getTotalRevenueByPeriod', {
          params: {
            start_date: this.startDate,
            end_date: this.endDate,
          }
        });
        this.products = response.data.products.map((product, index) => ({
          ...product,
          color: this.defaultColors[index % this.defaultColors.length] // Assign a color from the defaultColors array
        }));
      } catch (error) {
        console.error("Error fetching product sales:", error);
      }
    }
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
