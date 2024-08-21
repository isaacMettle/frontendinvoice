<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';
import { candidatesData } from "./Datausers";

export default {
  components: { Layout, PageHeader },
  name: 'ClientList',
  data() {
    return {
      Users: [],
      Roles: [],
      pagination: null,
      currentPage: 1,
      defaultImage: 'path/to/default/image.jpg',
      candidatesData,
      showCreateModal: false,
      showEditModal: false,
      showSuccessNotification: false,
      notificationMessage: '',
      newUser: {
        name: '',
        email: '',
        password: '',
        role_id: '',
      },
      
      editUserData: {
        id: null,
        name: '',
        email: '',
        password: '',
        role_id: '',
      },
      errors: {},
    };
  },
  mounted() {
    this.fetchUser();
    this.fetchRoles();
  },

  computed: {
    paginatedUsers() {
      return this.users;
    },
  },

  methods: {
   async fetchUser() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listUser');
        this.Users = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    },
    async fetchRoles() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listRole');
        this.Roles = response.data; // Ensure this is assigned correctly
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', error);
      }
    },
    getRoleName(roleId) {
      const role = this.Roles.find(r => r.id === roleId);
      return role ? role.name : 'Unknown';
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailInvalid = !emailPattern.test(this.newUser.email);
    },
    
    async createUser() {
      this.errors = {};
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/AddUsers', this.newUser);
        this.fetchUser();
        this.showCreateModal = false;
        this.resetNewUserForm();
        this.showSuccessNotification = true;
        setTimeout(() => {
          this.showSuccessNotification = false;
        }, 3000);
        console.log('Utilisateur créé avec succès:', response.data);
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
        }
      }
    },
    async updateUser() {
      this.errors = {};
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/updateUsers/${this.editUserData.id}`, this.editUserData);
        this.fetchUser();
        this.showEditModal = false;
        this.resetEditUserForm();
        console.log('Utilisateur mis à jour avec succès:', response.data);
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
        }
      }
    },
    async deleteUser(id) {
      if (confirm("Voulez-vous vraiment supprimer cet utilisateur?")) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/deleteUsers/${id}`);
          this.fetchUser();
          console.log('Utilisateur supprimé avec succès');
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        }
      }
    },
    editUser(user) {
      this.editUserData = { ...user };
      this.showEditModal = true;
    },
    resetNewUserForm() {
      this.newUser = {
        name: '',
        email: '',
        password: '',
        role_id: '', // Ensure this matches the dropdown v-model
      };
    },
    resetEditUserForm() {
      this.editUserData = {
        id: null,
        name: '',
        email: '',
        password: '',
        role: '',
      };
    }
  },
};
</script>
<style scoped>
.user-card {
  background-color: #f9f9f9; /* Light gray background for the card */
  border: 1px solid #dee2e6; /* Light border for the card */
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for better contrast */
  transition: box-shadow 0.3s, transform 0.3s;
}

.user-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Enhanced shadow on hover */
  transform: translateY(-5px); /* Slight lift effect on hover */
}

.avatar-title {
  background-color: #007bff; /* Strong blue color for better contrast */
  color: #fff;
  width: 60px;
  height: 60px;
  line-height: 60px;
  font-size: 24px;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, border-color 0.3s;
}

.btn-icon:hover {
  background-color: rgba(220, 53, 69, 0.1); /* Light red on hover */
  border-color: #dc3545; /* Red border on hover */
}

.text-muted {
  color: #6c757d; /* Slightly darker color for better readability */
}


</style>

<template>
  <Layout>
    <PageHeader title="Liste des utilisateurs" pageTitle="Utilisateurs" />
    <!-- Success Notification -->
    <BAlert v-model="showSuccessNotification" variant="success" dismissible>
      <b>Succès:</b> Utilisateur créé avec succès!
    </BAlert>
    <BRow>
      <BCol cols="12">
        <BCard no-body>
          <BCardBody>
            <BRow class="mb-2">
            <BCol sm="4">
              <div class="search-box d-inline-block mb-2">
                
              </div>
            </BCol>

              <BCol sm="8">
              <div class="text-sm-end">
              <div class="text-sm-end">
                <BButton variant="primary" class="me-1" @click="showCreateModal = true">Ajouter un utilisateur</BButton>
              </div>
              </div>
            </BCol>

              </BRow>
              <div class="table-responsive">                      
              <BRow>
              <BCol xl="4" sm="6" v-for="user in Users" :key="user.id">
                <BCard class="user-card">
                  <BRow>
                    <!-- User Avatar and Info -->
                    <BCol xl="5">
                      <div class="text-center p-4 border-end">
                        <div class="avatar-sm mx-auto mb-3 mt-1">
                          <span :class="`avatar-title rounded-circle bg-primary text-white font-size-16`">
                            {{ user.name.charAt(0).toUpperCase() }}
                          </span>
                        </div>
                        <h5 class="text-truncate pb-1">{{ user.name }}</h5>
                        <p class="text-muted mb-0">{{ user.email }}</p>
                      </div>
                    </BCol>

                    <!-- User Details and Actions -->
                    <BCol xl="7">
                      <div class="p-4 text-center text-xl-start">
                        <BRow>
                          <BCol cols="6">
                            <div>
                              <p class="text-muted mb-2 text-truncate"></p>
                              <h6>{{ getRoleName(user.role_id) }}</h6> <!-- Affiche le nom du rôle -->
                            </div>
                          </BCol>
                        </BRow>
                        <div class="mt-4">
                          <BLink @click="editUser(user)" class="text-decoration-underline text-reset" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Edit">
                            Edit Profile <i class="mdi mdi-arrow-right ms-1"></i>
                          </BLink>
                        </div>
                        <div class="mt-2">
                          <BButton variant="outline-danger" @click="deleteUser(user.id)" class="btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete">
                            <i class="mdi mdi-delete-outline"></i>
                          </BButton>
                        </div>
                      </div>
                    </BCol>
                  </BRow>
                </BCard>
              </BCol>
            </BRow>




            <b-pagination
      v-if="pagination"
      v-model="currentPage"
      :total-rows="pagination.total"
      :per-page="pagination.per_page"
      aria-controls="user-list"
      @change="fetchUsers"
    ></b-pagination>
                                      
          </div>
            <pagination />
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- Modal for creating a new user -->
                <!-- Modal de Création d'Utilisateur -->
                <BModal
    v-model="showCreateModal"
    title="Créer un Utilisateur"
    size="lg"
  >
    <BForm @submit.prevent="createUser">
      <BFormGroup label="Nom" label-for="user-name">
        <BFormInput
          id="user-name"
          v-model="newUser.name"
          required
          placeholder="Entrez le nom de l'utilisateur"
        />
      </BFormGroup>

      <BFormGroup label="Email" label-for="user-email">
        <BFormInput
          id="user-email"
          v-model="newUser.email"
          type="email"
          required
          placeholder="Entrez l'email de l'utilisateur"
          :class="{ 'is-invalid': emailInvalid }"
          @input="validateEmail"
        />
        <BFormInvalidFeedback v-if="emailInvalid">
          Veuillez entrer une adresse email valide.
        </BFormInvalidFeedback>
      </BFormGroup>

      <BFormGroup label="Mot de passe" label-for="user-password">
        <BInputGroup>
          <BFormInput
            id="user-password"
            v-model="newUser.password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Entrez le mot de passe"
          />
          <BInputGroupAppend>
            <BButton variant="outline-secondary" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
            </BButton>
          </BInputGroupAppend>
        </BInputGroup>
      </BFormGroup>
      <BFormGroup label="Rôle" label-for="role_id">
          <BFormSelect v-model="newUser.role_id" :options="Roles.map(role => ({ value: role.id, text: role.name }))" id="role_id"></BFormSelect>
      </BFormGroup>


      <BRow>
        <BCol class="mt-3">
          <BButton variant="success" type="submit" class="w-lg">Créer</BButton>
        </BCol>
      </BRow>
    </BForm>
  </BModal>

    

    <!-- Modal for editing an existing client -->
    <BModal v-model="showEditModal" title="Modifier utilisateur" title-class="font-18" body-class="p-3" hide-footer class="v-modal-custom">
      <BForm @submit.prevent="updateUser">
        <BRow>
          <BCol cols="12">
            <div class="mb-3">
              <label for="edit-name">Nom</label>
              <input id="edit-name" v-model="editUserData.name" type="text" class="form-control" placeholder="" />
              <div v-if="errors && errors.name" class="text-danger">{{ errors.name[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="edit-password">password</label>
              <input id="edit-password" v-model="editUserData.password" type="text" class="form-control" placeholder="" />
              <div v-if="errors && errors.password" class="text-danger">{{ errors.password[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="edit-email">Email</label>
              <input id="edit-email" v-model="editUserData.email" type="email" class="form-control" placeholder="" />
              <div v-if="errors && errors.email" class="text-danger">{{ errors.email[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for=" role">Role</label>
              <input id=" role" v-model="editUserData. role" type="text" class="form-control" placeholder="" />
              <div v-if="errors && errors. role" class="text-danger">{{ errors. role[0] }}</div>
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
