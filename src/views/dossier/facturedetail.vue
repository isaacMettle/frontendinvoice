<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';
import { listData } from "./Datafacture"
/** * Invoice-list component */
export default {
  components: { Layout, PageHeader },
  data() {
    return {    
        Invoice_Invoice_item_ClientInfo : [], 
        listData,  
    }
  },

  methods:{
    async fetchInvoice_Invoice_item_ClientInfo() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/Invoice-Invoice_item-ClientInfo');
        this.Invoice_Invoice_item_ClientInfo = response.data;
        console.log(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des Invoice_Invoice_item_ClientInfo:', error);
      }
    },
  },
 
  mounted() {
    this.fetchInvoice_Invoice_item_ClientInfo();
  
  },
  
};
</script>

<template>
  <Layout>
    <PageHeader title="Liste des factures" pageTitle="Factures" />

   
  </Layout>
</template>