<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';

export default {
  components: { Layout, PageHeader, },
  name: 'FactureList',
  data() {
    return {
      invoices: [],
      showCreateModal: false,
      showEditModal: false,
      newFacture: {
        prefix: '',
        id: this.generateInvoiceId(),
        suffix: '', 
        approbation: '',
        total: '',
        statut: '',
        date: '',
      },
      editClientData: {
        id: null,
        client_name: '',
        total: '',
        statut: '',
        date: '',
      },
      errors: {},
    };
  },
  mounted() {
    this.fetchinvoices();
  },
  methods: {
    generateInvoiceId() {
    return Math.floor(Math.random() * 10000); // Example ID generation logic
  },
  createFacture() {
    const factureData = {
      ...this.newFacture,
      invoice_number: `${this.newFacture.prefix}-${this.newFacture.id}-${this.newFacture.suffix}`
    };

    axios.post('/api/AddInvoices', factureData)
      .then(() => { // Pas besoin de déclarer 'response' si on ne l'utilise pas
        // Handle successful response
        this.showCreateModal = false;
        this.newFacture = {
          prefix: '',
          id: this.generateInvoiceId(),
          suffix: '',
          total: '',
          statut: '',
          approbation: '',
          date: ''
        };
      })
      .catch(error => {
        // Handle error response
        this.errors = error.response.data.errors;
      });
},

    async fetchinvoices() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/invoices-with-client-info');
        this.invoices = response.data;
        console.log(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des invoices:', error);
      }
    },
    async createClient() {
      this.errors = {};
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/AddClients', this.newClient);
        this.fetchClients();
        this.showCreateModal = false;
        this.resetNewClientForm();
        console.log('Client created successfully:', response.data);
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
        }
      }
    },
    async updateClient() {
      this.errors = {};
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/updateClients/${this.editClientData.id}`, this.editClientData);
        this.fetchClients();
        this.showEditModal = false;
        this.resetEditClientForm();
        console.log('Client updated successfully:', response.data);
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
        }
      }
    },
    editClient(client) {
      this.editClientData = { ...client };
      this.showEditModal = true;
    },
    resetNewClientForm() {
      this.newClient = {
        client_name: '',
        total: '',
        statut: '',
        date: '',
      };
    },
    resetEditClientForm() {
      this.editClientData = {
        id: null,
        client_name: '',
        total: '',
        statut: '',
        date: '',
      };
    }
  },
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
                    <input type="text" class="form-control" placeholder="Search..." />
                    <i class="bx bx-search-alt search-icon"></i>
                  </div>
                </div>
              </BCol>
              <BCol sm="8">
                <div class="text-sm-end">
                  <router-link to="/dossier/ajouterfacture">
                    <BButton variant="success" class="btn-rounded mb-2 me-2" >
                    <i class="mdi mdi-plus me-1"></i> Ajouter une facture
                  </BButton>
                  </router-link>
                 
                </div>
              </BCol>
            </BRow>
            <div class="table-responsive">
              <BTableSimple class="table-centered table-nowrap align-middle">
                <BThead>
                  <BTr>
                    <BTh>Numero</BTh>
                    <BTh>Nom de l'entreprise du client </BTh>
                    <BTh>Total</BTh>
                    <BTh>Statut</BTh>
                    <BTh>Date d'échéance</BTh>
                    <BTh>Action</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="(facture, index) in invoices" :key="index">
                    <BTd>{{ index + 1 }}</BTd>
                    <BTd>{{ facture.client_name }}</BTd>
                    <BTd>{{ facture.total }}</BTd>
                    <BTd>{{ facture.statut }}</BTd>
                    <BTd>{{ facture.date }}</BTd>
                    <BTd>
                      <ul class="list-unstyled hstack gap-1 mb-0">
                        <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Edit">
                          <BLink href="#" @click="editClient(client)" class="btn btn-sm btn-soft-info"><i class="mdi mdi-pencil-outline"></i></BLink>
                        </li>
                        <!-- Add other actions here -->
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
    <BModal v-model="showCreateModal" title="Ajouter une facture" title-class="font-18" body-class="p-3" hide-footer class="v-modal-custom">
  <BForm @submit.prevent="createFacture">
    <BRow>
      <BCol cols="12">
        <div class="mb-3">
          <label for="prefix">Préfixe</label>
          <input id="prefix" v-model="newFacture.prefix" type="text" class="form-control" placeholder="Prefixe" />
        </div>
      </BCol>
      <BCol cols="12">
        <div class="mb-3">
          <label for="invoice_id">ID de la facture</label>
          <input id="invoice_id" v-model="newFacture.id" type="text" class="form-control" placeholder="ID de la facture" disabled />
        </div>
      </BCol>
      <BCol cols="12">
        <div class="mb-3">
          <label for="suffix">Suffixe</label>
          <input id="suffix" v-model="newFacture.suffix" type="text" class="form-control" placeholder="Suffixe" />
        </div>
      </BCol>
      <!--BCol cols="12">
        <div class="mb-3">
          <label for="client_name">Nom</label>
          <input id="client_name" v-model="newFacture.client_name" type="text" class="form-control" placeholder="" />
          <div v-if="errors.client_name" class="text-danger">{{ errors.client_name[0] }}</div>
        </div>
      </BCol-->
      <BCol cols="12">
        <div class="mb-3">
          <label for="total">Total</label>
          <input id="total" v-model="newFacture.total" type="text" class="form-control" placeholder="" />
          <div v-if="errors.total" class="text-danger">{{ errors.total[0] }}</div>
        </div>
      </BCol>
      <BCol cols="12">
        <div class="mb-3">
          <label for="statut">Statut</label>
          <select id="statut" v-model="newFacture.statut" class="form-control">
            <option value="">Sélectionner un statut</option>
            <option value="payer">Payer</option>
            <option value="non payé">Non Payé</option>
          </select>
          <div v-if="errors.statut" class="text-danger">{{ errors.statut[0] }}</div>
        </div>
      </BCol>

      <BCol cols="12">
        <div class="mb-3">
          <label for="approbation">approbation</label>
          <select id="approbation" v-model="newFacture.statut" class="form-control">
            <option value="">Sélectionner une approbation</option>
            <option value="valide">valide</option>
            <option value="non valide">Non valide</option>
          </select>
          <div v-if="errors.statut" class="text-danger">{{ errors.statut[0] }}</div>
        </div>
      </BCol>

      <BCol cols="12">
        <div class="mb-3">
          <label for="date">Date</label>
          <input id="date" v-model="newFacture.date" type="text" class="form-control" placeholder="" />
          <div v-if="errors.date" class="text-danger">{{ errors.date[0] }}</div>
        </div>
      </BCol>
    </BRow>
    <div class="text-end pt-5 mt-3">
      <BButton variant="light" @click="showCreateModal = false">Fermer</BButton>
      <BButton type="submit" variant="success" class="ms-1">Enregistrer</BButton>
    </div>
  </BForm>
</BModal>


    <!-- Modal for editing a client -->
    <!--BModal v-model="showEditModal" title="Modifier utilisateur" title-class="font-18" body-class="p-3" hide-footer class="v-modal-custom">
      <BForm @submit.prevent="updateClient">
        <BRow>
          <BCol cols="12">
            <div class="mb-3">
              <label for="edit-name">Nom</label>
              <input id="edit-name" v-model="editClientData.name" type="text" class="form-control" placeholder="" />
              <div v-if="errors && errors.name" class="text-danger">{{ errors.name[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="edit-phone">NIF</label>
              <input id="edit-phone" v-model="editClientData.NIF" type="text" class="form-control" placeholder="" />
              <div v-if="errors && errors.NIF" class="text-danger">{{ errors.NIF[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="edit-email">Email</label>
              <input id="edit-email" v-model="editClientData.email" type="email" class="form-control" placeholder="" />
              <div v-if="errors && errors.email" class="text-danger">{{ errors.email[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="edit-address">Adresse</label>
              <input id="edit-address" v-model="editClientData.address" type="text" class="form-control" placeholder="" />
              <div v-if="errors && errors.address" class="text-danger">{{ errors.address[0] }}</div>
            </div>
          </BCol>
        </BRow>
        <div class="text-end pt-5 mt-3">
          <BButton variant="light" @click="showEditModal = false">Fermer</BButton>
          <BButton type="submit" variant="success" class="ms-1">Mettre à jour</BButton>
        </div>
      </BForm>
    </BModal-->
  </Layout>
</template>
