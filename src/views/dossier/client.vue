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
    <BCard no-body class="border-light shadow-sm">
      <BCardBody>
        <BRow class="mb-3">
          <BCol sm="4">
            <div></div>
          
          </BCol>
          <BCol sm="8">
            <div class="text-sm-end">
              <BButton variant="primary" class="me-1" @click="showCreateModal = true">Ajouter un client</BButton>
            </div>
          </BCol>
        </BRow>
        <div class="table-responsive">
  <BTableSimple class="table-custom table-striped table-hover table-bordered">
    <BThead>
      <BTr>
        <BTh>#</BTh>
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
        <BTd class="text-center">
          <ul class="list-unstyled d-flex justify-content-center gap-2 mb-0">
            <li>
              <BButton class="btn-custom" variant="success" @click="editClient(client)">
                <i class="mdi mdi-pencil d-block font-size-16"></i> Edit
              </BButton>
            </li>
            <li>
              <BButton class="btn-custom" variant="danger" @click="deleteClient(client.id)">
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
        <BModal v-model="showCreateModal" title="Ajouter nouveau utilisateur" hide-footer>
        <BForm @submit.prevent="createClient">
          <BRow>
            <BCol cols="12">
              <div class="mb-3">
                <label for="name" class="form-label">Nom</label>
                <input id="name" v-model="newClient.name" type="text" class="form-control" />
                <div v-if="errors.name" class="text-danger mt-1">{{ errors.name[0] }}</div>
              </div>
            </BCol>
            <BCol cols="12">
              <div class="mb-3">
                <label for="phone" class="form-label">NIF</label>
                <input id="phone" v-model="newClient.NIF" type="text" class="form-control" />
                <div v-if="errors.NIF" class="text-danger mt-1">{{ errors.NIF[0] }}</div>
              </div>
            </BCol>
            <BCol cols="12">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input id="email" v-model="newClient.email" type="email" class="form-control" />
                <div v-if="errors.email" class="text-danger mt-1">{{ errors.email[0] }}</div>
              </div>
            </BCol>
            <BCol cols="12">
              <div class="mb-3">
                <label for="address" class="form-label">Adresse</label>
                <input id="address" v-model="newClient.address" type="text" class="form-control" />
                <div v-if="errors.address" class="text-danger mt-1">{{ errors.address[0] }}</div>
              </div>
            </BCol>
          </BRow>
          <div class="text-end pt-4">
            <BButton variant="light" @click="showCreateModal = false">Fermer</BButton>
            <BButton type="submit" variant="success" class="ms-2">Enregistrer</BButton>
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
.v-modal-custom .modal-title {
  font-weight: bold;
}

.v-modal-custom .btn-light {
  background-color: #f8f9fa;
  border-color: #f8f9fa;
  color: #000;
}

.v-modal-custom .btn-success {
  background-color: #28a745;
  border-color: #28a745;
  color: #fff;
}

.text-danger {
  font-size: 0.875rem;
}
</style>

