<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';

export default {
  components: { Layout, PageHeader },
  name: 'ClientList',
  data() {
    return {
      clients: [],
      showCreateModal: false,
      showEditModal: false,
      newClient: {
        name: '',
        NIF: '',
        email: '',
        address: '',
      },
      editClientData: {
        id: null,
        name: '',
        NIF: '',
        email: '',
        address: '',
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
        const response = await axios.get('http://127.0.0.1:8000/api/listClient');
        this.clients = response.data;
        console.log(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error);
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
    async deleteClient(id) {
      if (confirm("Voulez-vous vraiment supprimer ce client?")) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/deleteClients/${id}`);
          this.fetchClients();
          console.log('Client deleted successfully');
        } catch (error) {
          console.error('Erreur lors de la suppression du client:', error);
        }
      }
    },
    editClient(client) {
      this.editClientData = { ...client };
      this.showEditModal = true;
    },
    resetNewClientForm() {
      this.newClient = {
        name: '',
        NIF: '',
        email: '',
        address: '',
      };
    },
    resetEditClientForm() {
      this.editClientData = {
        id: null,
        name: '',
        NIF: '',
        email: '',
        address: '',
      };
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Liste des clients" pageTitle="Clients" />

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
                  <BButton variant="success" class="btn-rounded mb-2 me-2" @click="showCreateModal = true">
                    <i class="mdi mdi-plus me-1"></i> Ajouter un client
                  </BButton>
                </div>
              </BCol>
            </BRow>
            <div class="table-responsive">
              <BTableSimple class="table-centered table-nowrap align-middle">
                <BThead>
                  <BTr>
                    <BTh>Numero</BTh>
                    <BTh>Nom</BTh>
                    <BTh>NIF</BTh>
                    <BTh>Email</BTh>
                    <BTh>Adresse</BTh>
                    <BTh>Action</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="(client, index) in clients" :key="index">
                    <BTd>{{ index + 1 }}</BTd>
                    <BTd>{{ client.name }}</BTd>
                    <BTd>{{ client.NIF }}</BTd>
                    <BTd>{{ client.email }}</BTd>
                    <BTd>{{ client.address }}</BTd>
                    <BTd>
                      <ul class="list-unstyled hstack gap-1 mb-0">
                        <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Edit">
                          <BLink href="#" @click="editClient(client)" class="btn btn-sm btn-soft-info"><i class="mdi mdi-pencil-outline"></i></BLink>
                        </li>
                        <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete">
                          <BLink href="#" @click="deleteClient(client.id)" class="btn btn-sm btn-soft-danger"><i class="mdi mdi-delete-outline"></i></BLink>
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
    <BModal v-model="showCreateModal" title="Ajouter nouveau utilisateur" title-class="font-18" body-class="p-3" hide-footer class="v-modal-custom">
      <BForm @submit.prevent="createClient">
        <BRow>
          <BCol cols="12">
            <div class="mb-3">
              <label for="name">Nom</label>
              <input id="name" v-model="newClient.name" type="text" class="form-control" placeholder="" />
              <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="phone">NIF</label>
              <input id="phone" v-model="newClient.NIF" type="text" class="form-control" placeholder="" />
              <div v-if="errors.NIF" class="text-danger">{{ errors.NIF[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="email">Email</label>
              <input id="email" v-model="newClient.email" type="email" class="form-control" placeholder="" />
              <div v-if="errors.email" class="text-danger">{{ errors.email[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="address">Adresse</label>
              <input id="address" v-model="newClient.address" type="text" class="form-control" placeholder="" />
              <div v-if="errors.address" class="text-danger">{{ errors.address[0] }}</div>
            </div>
          </BCol>
        </BRow>
        <div class="text-end pt-5 mt-3">
          <BButton variant="light" @click="showCreateModal = false">Fermer</BButton>
          <BButton type="submit" variant="success" class="ms-1">Enregistrer</BButton>
        </div>
      </BForm>
    </BModal>

    <!-- Modal for editing an existing client -->
    <BModal v-model="showEditModal" title="Modifier client" title-class="font-18" body-class="p-3" hide-footer class="v-modal-custom">
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
    </BModal>
  </Layout>
</template>
