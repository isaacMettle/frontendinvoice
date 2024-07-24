<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';

export default {
  components: { Layout, PageHeader },
  data() {
    return {
      clients: [],
      selectedClientId: null,
      editClientData: {
        name: '',
        NIF: '',
        email: '',
        address: '',
      },
      invoiceForm: {
        invoiceNumber: this.generateInvoiceNumber(),
        invoiceDate: '',
        dueDate: '',
        note: '',
        emailText: '',
      },
      itemForm: {
        description: '',
        unitPrice: '',
        vat: '',
      },
      errors: {},
    };
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
    async fetchClients() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listClient/');
        this.clients = response.data.map(client => ({ value: client.id, text: client.name }));
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    },
    async fetchClientData(clientId) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/clients/${clientId}`);
        this.editClientData = response.data;
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    },
    async updateClient() {
      this.errors = {};
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/updateClients', this.editClientData);
        console.log('Client updated successfully:', response.data);
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
        }
      }
    },
    generateInvoiceNumber() {
      const prefix = 'FA';
      const id = Date.now(); // Utiliser un identifiant basé sur le temps pour la démonstration
      const suffix = new Date().getFullYear();
      return `${prefix}-${id}-${suffix}`;
    },
    async submitInvoiceForm() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/invoices', this.invoiceForm);
        console.log('Invoice submitted successfully:', response.data);
        this.resetInvoiceForm();
      } catch (error) {
        console.error('Error submitting invoice form:', error);
      }
    },
    async submitItemForm() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/items', this.itemForm);
        console.log('Item added successfully:', response.data);
        this.resetItemForm();
      } catch (error) {
        console.error('Error submitting item form:', error);
      }
    },
    resetInvoiceForm() {
      this.invoiceForm = {
        invoiceNumber: this.generateInvoiceNumber(),
        invoiceDate: '',
        dueDate: '',
        note: '',
        emailText: '',
      };
    },
    resetItemForm() {
      this.itemForm = {
        description: '',
        unitPrice: '',
        vat: '',
      };
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Créer une facture" pageTitle="Clients" />
    <BContainer>
      <BRow>

          <!-- Formulaire pour la facture -->
          <BCol md="6">
          <BForm @submit.prevent="submitInvoiceForm" class="p-2">
            <BRow>
              <!-- Numéro de facture -->
              <BCol cols="12">
                <div class="mb-3">
                  <label for="invoice-number">Numéro de facture</label>
                  <input
                    id="invoice-number"
                    :value="generateInvoiceNumber()"
                    type="text"
                    class="form-control"
                    readonly
                  />
                </div>
              </BCol>
              <!-- Date de facture -->
              <BCol cols="12">
                <div class="mb-3">
                  <label for="invoice-date">Date de facture</label>
                  <input
                    id="invoice-date"
                    v-model="invoiceForm.invoiceDate"
                    type="date"
                    class="form-control"
                  />
                </div>
              </BCol>
              <!-- Date d'échéance -->
              <BCol cols="12">
                <div class="mb-3">
                  <label for="due-date">Date d'échéance</label>
                  <input
                    id="due-date"
                    v-model="invoiceForm.dueDate"
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
                  <label for="email-text">Texte de l'email</label>
                  <textarea
                    id="email-text"
                    v-model="invoiceForm.emailText"
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
          <BForm @submit.prevent="updateClient" class="p-2">
            <BRow>
              <BCol cols="12">
                <div class="mb-3">
                  <label for="client-select">Sélectionner un client</label>
                  <b-form-select
                    id="client-select"
                    v-model="selectedClientId"
                    :options="clients"
                    @change="fetchClientData"
                  ></b-form-select>
                </div>
              </BCol>
              <BCol cols="12">
                <div class="mb-3">
                  <label for="name">Nom</label>
                  <input id="name" v-model="editClientData.name" type="text" class="form-control" placeholder="" />
                </div>
              </BCol>
              <BCol cols="12">
                <div class="mb-3">
                  <label for="phone">NIF</label>
                  <input id="phone" v-model="editClientData.NIF" type="text" class="form-control" placeholder="" />
                </div>
              </BCol>
              <BCol cols="12">
                <div class="mb-3">
                  <label for="email">Email</label>
                  <input id="email" v-model="editClientData.email" type="email" class="form-control" placeholder="" />
                </div>
              </BCol>
              <BCol cols="12">
                <div class="mb-3">
                  <label for="address">Adresse</label>
                  <input id="address" v-model="editClientData.address" type="text" class="form-control" placeholder="" />
                </div>
              </BCol>
            </BRow>
          
          </BForm>
        </BCol>

        <!-- Formulaire pour ajouter des biens -->
        <BCol md="6">
          <BForm @submit.prevent="submitItemForm" class="p-2">
            <BRow>
              <!-- Description -->
              <BCol cols="12">
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
              <!-- Prix unitaire -->
              <BCol cols="12">
                <div class="mb-3">
                  <label for="unit-price">Prix unitaire</label>
                  <input
                    id="unit-price"
                    v-model="itemForm.unitPrice"
                    type="number"
                    step="0.01"
                    class="form-control"
                    placeholder="Prix unitaire"
                  />
                </div>
              </BCol>
              <!-- TVA -->
              <BCol cols="12">
                <div class="mb-3">
                  <label for="vat">TVA</label>
                  <input
                    id="vat"
                    v-model="itemForm.vat"
                    type="number"
                    step="0.01"
                    class="form-control"
                    placeholder="TVA (%)"
                  />
                </div>
              </BCol>
            </BRow>
          </BForm>
        </BCol>

      

       
      </BRow>
    </BContainer>
  </Layout>
</template>