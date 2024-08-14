<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { ref, onMounted , watch} from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';

const router = useRouter();
let invoices = ref([]); 
let filteredInvoices = ref([]); // Factures filtrées
let showPending = ref(false); // État du filtre
let showApproved = ref(false); // État du filtre pour les factures approuvées
let showNonApproved = ref(false); // État du filtre "non approuver"
let showEditModal = ref(false);
let currentInvoice = ref({});
let errors = ref({});
const invoiceId = ref(null);
const formData = ref({
  date: '',
  due_date: '',
  note: '',
  email_text: '',
  total: 0
});
const showUpdateModal = ref(false);

onMounted(async () => {
  await getInvoices1();
});

watch(showEditModal, (newValue) => {
  if (!newValue) {
    errors.value = {};
    currentInvoice.value = {};
  }
});

const getInvoices1 = async () => {
  try {
    let response = await axios.get('http://127.0.0.1:8000/api/listInvoice');
    invoices.value = response.data.invoices;
    applyFilters(); // Appliquer les filtres après la récupération des factures
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
  }
};

/*const openEditModal = (invoice) => {
  currentInvoice.value = { ...invoice };
  showEditModal.value = true;
};*/


// Méthode pour mettre à jour la facture
const updateInvoice = async () => {
  try {
    if (!invoiceId.value) {
      throw new Error('Invoice ID is not defined');
    }

    const response = await axios.put(`http://127.0.0.1:8000/api/update-invoice/${invoiceId.value}`, {
      date: formData.value.date,
      due_date: formData.value.due_date,
      note: formData.value.note,
      email_text: formData.value.email_text,
      total: formData.value.total,
    });

    console.log(response.data.message);
    showUpdateModal.value = false;
    await getInvoices1();
  } catch (error) {
    const errorMessage = error.response?.data?.errors || error.message;
    console.error('Erreur lors de la mise à jour de la facture:', errorMessage);
  }
};

const onShow = (id) => {
  router.push(`show/${id}`);
};

const deleteInvoice = async (invoiceId) => {
  if(confirm("Voulez-vous vraiment supprimer cette facture?")){
    try {
    await axios.delete(`http://127.0.0.1:8000/api/deleteInvoices/${invoiceId}`);
    await getInvoices1();
  } catch (error) {
    console.error('Erreur lors de la suppression de la facture:', error);
  }
  }
};



const updateApprobation = async (invoice) => {
  try {
    await axios.put(`http://127.0.0.1:8000/api/updateInvoice/${invoice.id}`, {
      approbation: invoice.approbation
    });
    console.log('Approbation mise à jour avec succès');
    await getInvoices1(); // Actualiser les factures après la mise à jour
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'approbation:', error);
  }
};

// Méthode pour filtrer les factures "en attente"
const filterPendingInvoices = () => {
  showPending.value = !showPending.value;
  showApproved.value = false; // Désactiver l'autre filtre
  applyFilters();
};

// Méthode pour filtrer les factures "approuver"
const filterApprovedInvoices = () => {
  showApproved.value = !showApproved.value;
  showPending.value = false; // Désactiver l'autre filtre
  applyFilters();
};

// Méthode pour filtrer les factures "non approuver"
const filterNonApprovedInvoices = () => {
  showNonApproved.value = !showNonApproved.value;
  if (showNonApproved.value) {
    filteredInvoices.value = invoices.value.filter(invoice => invoice.approbation === 'non approuver');
  } else {
    filteredInvoices.value = invoices.value;
  }
};

// Appliquer les filtres en fonction de l'état des boutons
const applyFilters = () => {
  if (showPending.value) {
    filteredInvoices.value = invoices.value.filter(invoice => invoice.approbation === 'en attente');
  } else if (showApproved.value) {
    filteredInvoices.value = invoices.value.filter(invoice => invoice.approbation === 'approuver');
  } else if (showNonApproved.value) {
    filteredInvoices.value = invoices.value.filter(invoice => invoice.approbation === 'non approuver');
  }else {
    filteredInvoices.value = invoices.value;
  }
};
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
                    <input type="text" class="form-control" placeholder="Search..." v-model="searchInvoice" @key="search" />
                    <i class="bx bx-search-alt search-icon"></i>
                  </div>
                </div>
              </BCol>
              <BCol sm="8">
                <div class="text-sm-end">
                  <!--BButton variant="primary" class="w-xs me-2" @click="getInvoices">Tout</BButton-->
                  <BButton class="me-2" variant="info" @click="filterPendingInvoices">
                    <i class="bx bx-hourglass bx-spin font-size-16 align-middle"></i>Facture en attente
                  </BButton>
                  <BButton class="me-2" variant="success" @click="filterApprovedInvoices"><i class="bx bx-check-double font-size-16 align-middle me-2"></i>Facture approuver</BButton>
                  <BButton variant="warning" class="btn-label me-2"  @click="filterNonApprovedInvoices"><i class="bx bx-error label-icon"></i> Facture non approuver</BButton>
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
                    <BTh>Action</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="(invoice, index) in filteredInvoices" :key="index">
                    <BTd>#{{ invoice.id }}</BTd>
                    <BTd>{{ invoice.date }}</BTd>
                    <BTd>{{ invoice.invoice_number }}</BTd>
                    <BTd v-if="invoice.client">{{ invoice.client.name }}</BTd>
                    <BTd v-else>{{ invoice.client }}</BTd>
                    <BTd>{{ invoice.due_date }}</BTd>
                    <BTd>{{ invoice.total }}</BTd>
                    <BTd>
                      <BFormSelect
                        v-model="invoice.approbation"
                        :options="['en attente','approuver', 'non approuver']"
                        @change="updateApprobation(invoice)"
                      ></BFormSelect>
                    </BTd>
                    <BTd class="text-center">
                      <ul class="list-unstyled d-flex justify-content-center gap-2 mb-0">
                        <li>
                          <BButton class="btn-custom" variant="dark" @click="onShow(invoice.id)">voir</BButton>
                        </li>
                        <!--li>
                          <BButton class="btn-custom" variant="success" @click="openEditModal(invoice)">
                            <i class="mdi mdi-pencil d-block font-size-16"></i> Edit
                          </BButton>
                        </li-->
                        <li>
                          <BButton class="btn-custom" variant="danger" @click="deleteInvoice(invoice.id)">
                            <i class="mdi mdi-trash-can d-block font-size-16"></i> Delete
                          </BButton>
                        </li>
                      </ul>
                    </BTd>
                  </BTr>
                </BTbody>
              </BTableSimple>
            </div>

            <pagination />
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- Modal for creating a new client -->
    <BModal
  v-model="showEditModal"
  title="Modifier la facture"
  title-class="font-weight-bold text-primary"
  body-class="p-4"
  hide-footer
  class="v-modal-custom"
  size="lg"
  centered
>
  <BForm @submit.prevent="updateInvoice">
    <BRow>
      <BCol cols="12">
        <div class="mb-4">
          <label for="invoiceNumber" class="form-label">Numéro de Facture</label>
          <input
            id="invoiceNumber"
            v-model="currentInvoice.invoice_number"
            type="text"
            class="form-control"
            placeholder="Entrez le numéro de facture"
          />
          <div v-if="errors.invoice_number" class="text-danger mt-1">{{ errors.invoice_number[0] }}</div>
        </div>
      </BCol>
      <BCol cols="12">
        <div class="mb-4">
          <label for="date" class="form-label">Date</label>
          <input
            id="date"
            v-model="currentInvoice.date"
            type="date"
            class="form-control"
            placeholder="Entrez la date"
          />
          <div v-if="errors.date" class="text-danger mt-1">{{ errors.date[0] }}</div>
        </div>
      </BCol>
      <BCol cols="12">
        <div class="mb-4">
          <label for="dueDate" class="form-label">Date d'échéance</label>
          <input
            id="dueDate"
            v-model="currentInvoice.due_date"
            type="date"
            class="form-control"
            placeholder="Entrez la date d'échéance"
          />
          <div v-if="errors.due_date" class="text-danger mt-1">{{ errors.due_date[0] }}</div>
        </div>
      </BCol>
      <BCol cols="12">
        <div class="mb-4">
          <label for="total" class="form-label">Total</label>
          <input
            id="total"
            v-model="currentInvoice.total"
            type="number"
            class="form-control"
            placeholder="Entrez le total"
          />
          <div v-if="errors.total" class="text-danger mt-1">{{ errors.total[0] }}</div>
        </div>
      </BCol>
    </BRow>
    <div class="text-end pt-4">
      <BButton variant="light" @click="showEditModal = false" class="me-2">Fermer</BButton>
      <BButton type="submit" variant="success">Enregistrer</BButton>
    </div>
  </BForm>
</BModal>


  </Layout>
</template>

<style scoped>
/* Dans le fichier CSS principal ou styles scoped */
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

.table-custom .btn-soft-info {
  background-color: #e7f0ff;
  color: #007bff;
  border: none;
}

.table-custom .btn-soft-info:hover {
  background-color: #d0e3ff;
}

.table-custom .btn-soft-danger {
  background-color: #f8d7da;
  color: #dc3545;
  border: none;
}

.table-custom .btn-soft-danger:hover {
  background-color: #f1b0b7;
}
.btn-custom {
    min-width: 100px; /* Largeur fixe */
    height: 40px;     /* Hauteur fixe */
    font-size: 14px;  /* Taille de police ajustée si nécessaire */
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
