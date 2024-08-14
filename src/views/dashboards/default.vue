<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { ref, onMounted } from 'vue';
import axios from 'axios';

const totalInvoices = ref(0);
const totalClients = ref(0);
const sentInvoices = ref(0);
const totalRevenue = ref(0);
const recentInvoices = ref([]);

const fetchDashboardData = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/dashboard-stats');
  totalInvoices.value = response.data.totalInvoices;
  totalClients.value = response.data.totalClients; 
  totalRevenue.value = response.data.totalRevenue;
  sentInvoices.value = response.data.sentInvoices; 
};

const fetchRecentInvoices = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/recent-invoices?limit=5');
  recentInvoices.value = response.data.recentInvoices;
};




onMounted(() => {
  fetchDashboardData();
  fetchRecentInvoices();
});
</script>

<template>
  <Layout>
    <PageHeader title="Dashboard" pageTitle="Overview" />

    <div class="row">
      <!-- Total Invoices Created -->
      <div class="col-md-3">
        <BCard class="text-center bg-primary text-white">
          <BCardBody>
            <i class="fas fa-file-invoice fa-2x mb-3"></i>
            <BCardTitle>Total Invoices Created</BCardTitle>
            <h3>{{ totalInvoices }}</h3>
          </BCardBody>
        </BCard>
      </div>

      <!-- Registered Clients -->
      <div class="col-md-3">
        <BCard class="text-center bg-success text-white">
          <BCardBody>
            <i class="fas fa-users fa-2x mb-3"></i>
            <BCardTitle>Registered Clients</BCardTitle>
            <h3>{{ totalClients }}</h3>
          </BCardBody>
        </BCard>
      </div>

      <!-- Invoices Sent -->
      <div class="col-md-3">
        <BCard class="text-center bg-warning text-dark">
          <BCardBody>
            <i class="fas fa-paper-plane fa-2x mb-3"></i>
            <BCardTitle>Invoices Sent</BCardTitle>
            <h3>{{ sentInvoices }}</h3>
          </BCardBody>
        </BCard>
      </div>

      <!-- Total Revenue -->
      <div class="col-md-3">
        <BCard class="text-center bg-info text-white">
          <BCardBody>
            <i class="fas fa-dollar-sign fa-2x mb-3"></i>
            <BCardTitle>Total Revenue</BCardTitle>
            <h3>{{ totalRevenue }}</h3>
          </BCardBody>
        </BCard>
      </div>
    </div>

    <!--div class="row mt-4">
     
      <div class="col-md-6">
        <BCard>
          <BCardHeader class="bg-primary text-white">
            <i class="fas fa-chart-line me-2"></i> Monthly Revenue
          </BCardHeader>
          <BCardBody>
      
          </BCardBody>
        </BCard>
      </div>

  
      <div class="col-md-6">
        <BCard>
          <BCardHeader class="bg-success text-white">
            <i class="fas fa-chart-pie me-2"></i> Invoices Status Distribution
          </BCardHeader>
          <BCardBody>
          
          </BCardBody>
        </BCard>
      </div>
    </div-->

    <div class="row mt-4">
      <!-- Recent Invoices Table -->
      <div class="col-md-12">
        <BCard>
          <BCardHeader class="bg-secondary text-white">
            <i class="fas fa-list me-2"></i> Recent Invoices
          </BCardHeader>
          <BCardBody>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Invoice ID</th>
                  <th scope="col">Client</th>
                  <th scope="col">Montant</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="invoice in recentInvoices" :key="invoice.id">
                  <td>{{ invoice.id }}</td>
                  <td v-if="invoice.client">{{ invoice.client.name  }}</td>
                  <td v-else>{{ invoice.client }}</td>
                  <td>{{ invoice.total }}</td>
                  <td>{{ invoice.date }}</td>
                  <td>{{ invoice.statut }}</td>
                </tr>
              </tbody>
            </table>
          </BCardBody>
        </BCard>
      </div>
    </div>
  </Layout>
</template>


<style scoped>
.bg-primary {
  background-color: #007bff !important;
}

.bg-success {
  background-color: #28a745 !important;
}

.bg-warning {
  background-color: #ffc107 !important;
}

.bg-info {
  background-color: #17a2b8 !important;
}

.bg-secondary {
  background-color: #6c757d !important;
}

.text-center {
  text-align: center !important;
}

.mb-3 {
  margin-bottom: 1rem !important;
}

h3 {
  font-size: 1.75rem;
  margin: 0;
}

.me-2 {
  margin-right: 0.5rem !important;
}
</style>