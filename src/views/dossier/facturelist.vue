<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { ref, onMounted, defineProps } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';

const router = useRouter();

const invoices = ref([]);
const searchInvoice = ref('');



const props = defineProps({
    id: {
        type: String,
        default: ''
    }
});

const form = ref({ id:'' });



const getInvoice = async () => {
    try {
        console.log('Fetching invoice with ID:', props.id);
        let response = await axios.get(`http://127.0.0.1:8000/api/show_invoice/${props.id}`);
        console.log('form', response.data.invoice);
        form.value = response.data.invoice;
    } catch (error) {
        console.error('Erreur lors de la récupération des elements de la facture:', error);
    }
};


onMounted(async () => {
  await getInvoices1();

  if (props.id) {
        getInvoice();
    } else {
        console.error('No ID provided');
    }
});

const getInvoices1 = async () => {
  try {
    let response = await axios.get('http://127.0.0.1:8000/api/listInvoice');
    invoices.value = response.data.invoices;
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
  }
};

const search = async () => {
  try {
    let response = await axios.get(`http://127.0.0.1:8000/api/search_invoice?s=${searchInvoice.value}`);
    invoices.value = response.data.invoices;
  } catch (error) {
    console.error('Erreur lors de la recherche des factures:', error);
  }
};

const newInvoice = async () => {
  try {
    await axios.get('http://127.0.0.1:8000/api/create_invoice');
    router.push('/dossier/ajouterfacture');
  } catch (error) {
    console.error('Erreur lors de la création de la facture:', error);
  }
};

const sendInvoice = async (invoiceId) => {
    try {
        // Envoyer la facture via l'API
        await axios.post(`http://127.0.0.1:8000/api/send_invoice/${invoiceId}`);

        // Mettre à jour le statut de la facture en 'envoyé'
        await axios.patch(`http://127.0.0.1:8000/api/update_invoice_status/${invoiceId}`, { statut: 'envoyé' });

        // Réactualiser la liste des factures pour refléter le changement
        await getInvoices1();

        alert('Invoice sent and status updated successfully.');
    } catch (error) {
        console.error('Error sending invoice:', error);
        alert('Failed to send invoice.');
    }
};




const onShow = (id) => {
  router.push(`show/${id}`);
};

const deleteInvoice = async (invoiceId) => {
  if (confirm("Voulez-vous vraiment supprimer cette facture?")) {
    try {
    await axios.delete(`http://127.0.0.1:8000/api/deleteInvoices/${invoiceId}`);
    await getInvoices1();
    console.log('Client deleted successfully');
  } catch (error) {
    console.error('Erreur lors de la suppression de la facture:', error);
  }
  }
};

const onEdit = (id) =>{
  router.push('edit/'+id)
}

/*const editInvoice = (invoice) => {
  router.push({ name: 'EditInvoice', params: { id: invoice.id } });
};*/
</script>

<template>
  <Layout>
    <PageHeader title="Liste des factures" pageTitle="factures" />

    <BRow>
      <BCol cols="12">
        <BCard no-body>
          <BCardBody>
            <BRow class="mb-2">
              <BCol sm="4">
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <input type="text" class="form-control" placeholder="Search..." v-model="searchInvoice" @input="search" />
                    <i class="bx bx-search-alt search-icon"></i>
                  </div>
                </div>
              </BCol>
              <BCol sm="8">
                <div class="text-sm-end">
                  <BButton variant="primary" class="me-1" @click="newInvoice" > Nouvelle facture</BButton>
                </div>
              </BCol>
            </BRow>
            <div class="table-responsive">
              <BTableSimple class="table-custom table-striped table-hover table-bordered">
                <BThead>
                  <BTr>
                    <BTh>ID</BTh>
                    <BTh>Date</BTh>
                    <BTh>Number</BTh>
                    <BTh>Customer</BTh>
                    <BTh>Due Date</BTh>
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
                    <BTd v-if="invoice.client">{{ invoice.client.name }}</BTd>
                    <BTd v-else>{{ invoice.client }}</BTd>
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
                      <BButton class="btn-custom" variant="dark" @click="onShow(invoice.id)" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">voir</BButton>
                    </li>
                    <li>
                      <BButton class="btn-custom" variant="dark" @click="sendInvoice(invoice.id)" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
                        <i class="fas fa-envelope"></i> Envoyer
                      </BButton>
                    </li>
                    <li>
                      <BButton class="btn-custom" variant="success" @click="onEdit(invoice.id)" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
                        <i class="mdi mdi-pencil d-block font-size-16"></i> Edit
                      </BButton>
                    </li>
                    <li>
                      <BButton class="btn-custom" variant="danger" @click="deleteInvoice(invoice.id)" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
                        <i class="mdi mdi-trash-can d-block font-size-16"></i> Delete
                      </BButton>
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
    <BModal v-model="showCreateModal" title="Ajouter une facture" title-class="font-18" body-class="p-3" hide-footer class="v-modal-custom"></BModal>
  </Layout>
</template>

<style scoped>
/* Custom styles for the table */
.table-custom {
  border-radius: 8px;
  overflow: hidden;
}

.table-custom thead th {
  background-color: #007bff;
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
