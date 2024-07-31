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
    /*try {
        const response = await axios.post('http://127.0.0.1:8000/api/AddInvoiceItems', itemForm.value);
        showCreateModal.value = false;
        resetItemForm();
        console.log('ligne Facture created successfully:', response.data);
      } catch (error) {
        if (error.response) {
          errors.value = error.response.data.errors || {};
        }
      }

      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/updateClients/${editClientData.value.id}`, editClientData.value);
        fetchClients();
        showCreateModal.value = false;
        resetEditClientForm();
        console.log('Client updated successfully:', response.data);
      } catch (error) {
        if (error.response) {
          errors.value = error.response.data.errors || {};
        }
      }*/
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
                    <BButton variant="success" class="btn-rounded mb-2 me-2"  >
                    <i class="mdi mdi-plus me-1"></i> Ajouter une facture
                  </BButton>
                  </router-link>
                 
                </div>
              </BCol>
            </BRow>
            <div class="table-responsive">
              <BRow>
      <BCol xl="4" sm="6" v-for="(invoice, index) in Invoice_Invoice_item_ClientInfo" :key="index">
        <BCard no-body>
          <BCardBody>
            <BRow>
              <BCol lg="4">
                <div class="text-lg-center">
                  <span class="avatar-sm me-3 mx-lg-auto mb-3 mt-1 float-start float-lg-none d-flex">
                    <span class="avatar-title rounded-circle bg-primary-subtle text-primary font-size-16">
                      {{ invoice.client_name.charAt(0) }}
                    </span>
                  </span>
                  <h5 class="mb-1 font-size-15 text-truncate">{{ invoice.client_name }}</h5>
                  <BLink href="#" class="text-muted">{{ invoice.client_email }}</BLink>
                </div>
              </BCol>
              <BCol lg="8">
                <div>
                  <h5 class="text-truncate mb-4 mb-lg-5">{{ invoice.total_price }}</h5>
                  <ul class="list-inline mb-0">
                    <li class="list-inline-item me-3">
                      <h5 class="font-size-14" data-toggle="tooltip" data-placement="top" title="total">
                        <i class="bx bx-money me-1 text-muted"></i> {{ invoice.total_price }}
                      </h5>
                    </li>
                    <li class="list-inline-item ms-1">
                      <h5 class="font-size-14" data-toggle="tooltip" data-placement="top" title="Date">
                        <i class="bx bx-calendar me-1 text-muted"></i> {{ invoice.invoice_date }}
                      </h5>
                    </li>
                  </ul>
                </div>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
            </div>
            <pagination />
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- Modal for creating a new client -->
    <BModal v-model="showCreateModal" title="Ajouter une facture" title-class="font-18" body-class="p-3" hide-footer class="v-modal-custom">
  
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

<!--script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';

import { ref, onMounted } from 'vue';

export default {
  components: { Layout, PageHeader },
  setup() {
    const generateInvoiceNumber = () => {
      const prefix = 'FA';
      const id = Math.floor(Math.random() * 10000); // Utiliser un identifiant basé sur le temps pour la démonstration
      const suffix = new Date().getFullYear();
      return `${prefix}-${id}-${suffix}`;
    };

    const clients = ref([]);
    const invoices = ref([]);
    const produit = ref([]);

    const showCreateModal = ref(false);

    const selectedClientId = ref(null);
    const editClientData = ref({
      id: null,
      name: '',
      NIF: '',
      email: '',
      address: '',
    });
    const invoiceForm = ref({
      invoice_number: generateInvoiceNumber(),
      date: '',
      due_date: '',
      note: '',
      email_text: '',
      client_id: ''
    });
    const itemForm = ref({
      description: '',
      prix_unitaire: '',
      tva: '',
      total: '',
      quantity: '',
    });
    const errors = ref({});

    onMounted(() => {
      fetchClients();
      fetchFacture();
      fetchProduit();
    });

    const calculateTotal = () => {
      itemForm.value.total = (itemForm.value.prix_unitaire * itemForm.value.quantity).toFixed(2);
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listClient');
        clients.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFacture = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listInvoice');
        invoices.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProduit = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listProduct');
        produit.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const editClient = (id) => {
      const client = clients.value.find(client => client.id === id);
      if (client) {
        editClientData.value = { ...client };
      }
    };

const createFacture = async () => {
  errors.value = {};
  try {
    if (editClientData.value.id === null) {
      // Création d'un nouveau client
      const clientResponse = await axios.post('http://127.0.0.1:8000/api/AddClients', editClientData.value);
      const newClientId = clientResponse.data.id;
      console.log('Client created successfully:', clientResponse.data);
      invoiceForm.value.client_id = newClientId;
    } else {
      // Mise à jour d'un client existant
      const updateResponse = await axios.put(`http://127.0.0.1:8000/api/updateClients/${editClientData.value.id}`, editClientData.value);
      console.log('Client updated successfully:', updateResponse.data);
      fetchClients();
    }

    // Création de la facture
    invoiceForm.value.client_id = selectedClientId.value;
    const invoiceResponse = await axios.post('http://127.0.0.1:8000/api/AddInvoices', invoiceForm.value);
    const invoiceId = invoiceResponse.data.id;
    console.log('Invoice created successfully:', invoiceResponse.data);

    // Création des articles de la facture
    const invoiceItemsResponse = await axios.post('http://127.0.0.1:8000/api/AddInvoiceItems', {
      ...itemForm.value,
      invoice_id: invoiceId,
    });
    console.log('Invoice items created successfully:', invoiceItemsResponse.data);

    // Rafraîchir la liste des factures et réinitialiser les formulaires
    fetchFacture();
    showCreateModal.value = false;
    resetInvoiceForm();
    resetItemForm();
    resetEditClientForm();

  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      console.error('An error occurred:', error);
    }
  }
};



    const clearForm = () => {
      invoiceForm.value = {
        invoice_number: generateInvoiceNumber(),
        date: '',
        due_date: '',
        note: '',
        email_text: '',
        client_id: ''
      };
      itemForm.value = {
        description: '',
        prix_unitaire: '',
        tva: '',
        total: '',
        quantity: '',
      };
      selectedClientId.value = null;
      editClientData.value = {
        id: null,
        name: '',
        NIF: '',
        email: '',
        address: '',
      };
      errors.value = {};
    };
    const resetInvoiceForm = () => {
  invoiceForm.value = {
    invoice_number: generateInvoiceNumber(),
    date: '',
    due_date: '',
    note: '',
    email_text: '',
    client_id: '', // Assurez-vous que le champ client_id est réinitialisé également
  };
};

const resetItemForm = () => {
  itemForm.value = {
    description: '',
    prix_unitaire: '',
    tva: '',
    total: '',
    quantity: '',
  };
};

const resetEditClientForm = () => {
  editClientData.value = {
    id: null,
    name: '',
    NIF: '',
    email: '',
    address: '',
  };
};


    return {
      clients,
      invoices,
      produit,
      selectedClientId,
      editClientData,
      invoiceForm,
      itemForm,
      errors,
      showCreateModal,
      fetchClients,
      fetchFacture,
      fetchProduit,
      createFacture,
      editClient,
      clearForm,
      calculateTotal,
      resetInvoiceForm,
      resetItemForm,
      resetEditClientForm,
    };
  },
};
</script>


<template>
  <Layout>
    <PageHeader title="Créer une facture" pageTitle="Comptable" />
    
    <BContainer>
      
      <BForm @submit.prevent="createFacture">
        <BRow>
          <Formulaire pour la facture>
          <BCol md="6">
            <h4 class="mt-3 mb-2">Enregistrer la facture</h4>
            <BForm class="p-2">
              <BRow>
                <Numéro de facture>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="invoice_number">Numéro de facture</label>
                    <input
                      id="invoice_number"
                      v-model="invoiceForm.invoice_number"
                      type="text"
                      class="form-control"
                      readonly
                    />
                  </div>
                </BCol>
                <Date de facture>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="date">Date de facture</label>
                    <input
                      id="date"
                      v-model="invoiceForm.date"
                      type="date"
                      class="form-control"
                    />
                  </div>
                </BCol>
                <Date d'échéance>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="due_date">Date d'échéance</label>
                    <input
                      id="due_date"
                      v-model="invoiceForm.due_date"
                      type="date"
                      class="form-control"
                    />
                  </div>
                </BCol>
                < Note>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="note">Note</label>
                    <textarea
                      id="note"
                      v-model="invoiceForm.note"
                      class="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                </BCol>
                <Email>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="email_text">Texte de l'email</label>
                    <textarea
                      id="email_text"
                      v-model="invoiceForm.email_text"
                      class="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                </BCol>
              </BRow>
            </BForm>
          </BCol>

          <Formulaire pour le client >
          <BCol md="6">
            <h4 class="mt-3 mb-2">Liste des clients</h4>
            <BForm @submit.prevent="createFacture" class="p-2">
              <BRow>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="client-select">Sélectionner un client</label>
                    <b-form-select
                      id="client-select"
                      v-model="selectedClientId"
                      :options="clients.map(client => ({ value: client.id, text: client.name }))"
                      @change="editClient(selectedClientId)"
                    ></b-form-select>
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="name">Nom</label>
                    <input
                      id="name"
                      v-model="editClientData.name"
                      type="text"
                      class="form-control"
                      placeholder=""
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="phone">NIF</label>
                    <input
                      id="phone"
                      v-model="editClientData.NIF"
                      type="text"
                      class="form-control"
                      placeholder=""
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="email">Email</label>
                    <input
                      id="email"
                      v-model="editClientData.email"
                      type="email"
                      class="form-control"
                      placeholder=""
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="address">Adresse</label>
                    <input
                      id="address"
                      v-model="editClientData.address"
                      type="text"
                      class="form-control"
                      placeholder=""
                    />
                  </div>
                </BCol>
              </BRow>
            </BForm>
          </BCol>

          <Formulaire pour ajouter des produits>
          <BCol md="6">
            <BForm @submit.prevent="createFacture" class="p-2">
              <BRow>
                <BCol cols="12">
                  <h4 class="mt-3 mb-2">Ajouter des produits</h4>
                  <div class="mb-3">
                    <label for="description">Description</label>
                    <input
                      id="description"
                      v-model="itemForm.description"
                      type="text"
                      class="form-control"
                      placeholder="Description du bien"
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="prix_unitaire">Prix unitaire</label>
                    <input
                      id="prix_unitaire"
                      v-model="itemForm.prix_unitaire"
                      @input="calculateTotal"
                      type="number"
                      step="0.01"
                      class="form-control"
                      placeholder="Prix unitaire"
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="tva">TVA</label>
                    <input
                      id="tva"
                      v-model="itemForm.tva"
                      type="number"
                      step="0.01"
                      class="form-control"
                      placeholder="TVA (%)"
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="quantity">Quantity</label>
                    <input
                      id="quantity"
                      v-model="itemForm.quantity"
                      @input="calculateTotal"
                      type="number"
                      step="0.01"
                      class="form-control"
                      placeholder="Quantity"
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="total">Total</label>
                    <input
                      id="total"
                      v-model="itemForm.total"
                      type="number"
                      step="0.01"
                      class="form-control"
                      placeholder="Total"
                      readonly
                    />
                  </div>
                </BCol>
              </BRow>
            </BForm>
          </BCol>
          
        </BRow> 
        <div class="text-end pt-5 mt-3">
              <BButton type="submit" variant="primary" class="w-md">Enregistrer une facture</BButton>
            </div>

      </BForm>
    
    </BContainer>
  </Layout>
</template-->

