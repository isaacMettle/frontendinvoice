<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { ref, onMounted,  } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
import Swal from 'sweetalert2';

const router = useRouter();

const invoices = ref([]);


onMounted(async () => {
   getInvoices1(); 
});

const getInvoices1 = async () => {
  try {
    let response = await axios.get('http://127.0.0.1:8000/api/client-invoices');
    invoices.value = response.data; // Mettre à jour la liste des factures
} catch (error) {
    if (error.response && error.response.status === 401) {
        Swal.fire('Erreur', 'Vous devez être connecté pour accéder à cette ressource.', 'error');
        // Redirection vers la page de connexion
        router.push('/loginclient');
    } else {
        Swal.fire('Erreur', 'Erreur lors de la récupération des factures.', 'error');
    }
}

};



const onShow = (id) => {
  router.push(`showC/${id}`);
};

</script>

<template>
  <Layout>
    <PageHeader title="Vos factures" pageTitle="factures" />

    <BRow>
      <BCol cols="12">
        <BCard no-body>
          <BCardBody>
            <div class="table-responsive">
              <BTableSimple class="table-custom table-striped table-hover table-bordered">
                <BThead>
                  <BTr>
                    <BTh>ID</BTh>
                    <BTh>Date</BTh>
                    <BTh>Numero facture</BTh>
                    <BTh> Date d'echeance</BTh>
                    <BTh>Total</BTh>
                    <BTh>Approbation</BTh>
                    <BTh>Statut</BTh>
                    <BTh>Action</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="(invoice, index) in invoices" :key="index">
                    <BTd>#{{ invoice.id }}</BTd>
                    <BTd>{{ invoice.date }}</BTd>
                    <BTd>{{ invoice.invoice_number }}</BTd>
                    <BTd>{{ invoice.due_date }}</BTd>
                    <BTd>{{ invoice.total }}</BTd>
                    <BTd>{{ invoice.approbation }}</BTd>
                    <BTd>
                      <BBadge :variant="invoice.statut === 'payer' ? 'success' : (invoice.statut === 'envoyé' ? 'info' : 'warning')">
                        {{ invoice.statut }}
                      </BBadge>
                    </BTd>
                    <BTd class="text-center">
                  <ul class="list-unstyled d-flex justify-content-center gap-2 mb-0">
                    <li>
                      <BButton class="btn-custom" variant="dark" @click="onShow(invoice.id)" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">voir la facture</BButton>
                    </li>
                  </ul>
                </BTd>
                  </BTr>
                </BTbody>
              </BTableSimple>
              <!-- Pagination Control -->
             
            </div>

            <pagination />
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- Modal for creating a new client -->
   
  </Layout>
</template>

<style scoped>
/* Custom styles for the table */
.table-custom {
  border-radius: 8px;
  overflow: hidden;
}

.table-custom thead th {
  background-color: #0f8562;
  color: #fff;
  font-weight: bold;
  text-align: center;
}

.table-custom tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table-custom tbody tr:hover {
  background-color: #f1f1f1;
}

.table-custom td, .table-custom th {
  vertical-align: middle;
  text-align: center;
  padding: 12px;
}

.table-custom td {
  font-size: 14px;
}

.table-custom .btn-custom {
  min-width: 100px;
  height: 40px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-custom {
  padding: 0.2rem 0.4rem !important; /* Ensure padding is applied */
  font-size: 0.75rem !important;     /* Ensure font size is applied */
  line-height: 1.2 !important;
  border-radius: 0.2rem; /* Optional: Adjust border radius if needed */
}

.btn-custom i {
  font-size: 0.75rem !important; /* Adjust icon size if needed */
}
</style>