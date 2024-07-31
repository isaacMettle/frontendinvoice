<script>
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
      invoice_id: '',
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
        console.log(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error);
      }
    };

    const fetchProduit = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listProduct');
        produit.value = response.data;
        console.log(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    };

    

    const fetchFacture = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listInvoice/');
        invoices.value = response.data;
        console.log(response);
      } catch (error) {
        console.error('Error lors de la recuperation de la facture:', error);
      }
    };

    const createFacture = async () => {
      errors.value = {};
      try {
        invoiceForm.value.client_id = selectedClientId.value;
        const response = await axios.post('http://127.0.0.1:8000/api/AddInvoices', invoiceForm.value);
        fetchFacture();
        showCreateModal.value = false;
        resetInvoiceForm();
        console.log('Facture created successfully:', response.data);
      } catch (error) {
        if (error.response) {
          errors.value = error.response.data.errors || {};
        }
      }

      try {
        itemForm.value.invoice_id = response.data.id;
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
      }
    };

    const editClient = (clientId) => {
      const client = clients.value.find(c => c.id === clientId);
      editClientData.value = { ...client };
      showCreateModal.value = true;
    };

    const resetInvoiceForm = () => {
      invoiceForm.value = {
        invoice_number: generateInvoiceNumber(),
        date: '',
        due_date: '',
        note: '',
        email_text: '',
        client_id: ''
      };
    };

    const resetItemForm = () => {
      itemForm.value = {
        invoice_id: '',
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
      showCreateModal,
      selectedClientId,
      editClientData,
      invoiceForm,
      itemForm,
      errors,
      calculateTotal,
      fetchClients,
      fetchProduit,     
      fetchFacture,
      generateInvoiceNumber,
      createFacture,
      editClient,
      resetInvoiceForm,
      resetItemForm,
      resetEditClientForm,
    };
  }
};
</script>

<template>
  <Layout>
    <PageHeader title="Créer une facture" pageTitle="Comptable" />
    <BContainer>
      <BForm @submit.prevent="createFacture">
        <BRow>
          <!-- Formulaire pour la facture -->
          <BCol md="6">
            <h4 class="mt-3 mb-2">Enregistrer la facture</h4>
            <BForm class="p-2">
              <BRow>
                <!-- Numéro de facture -->
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
                <!-- Date de facture -->
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
                <!-- Date d'échéance -->
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
                <!-- Note -->
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
                <!-- Email -->
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

          <!-- Formulaire pour le client -->
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

          <!-- Formulaire pour ajouter des produits -->
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
          <BButton type="submit" variant="success" class="ms-1">Enregistrer une facture</BButton>
        </div>

      </BForm>
    </BContainer>
  </Layout>
</template>
