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
        console.log(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    },

   

    async fetchRoles() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listRole');
        this.roles = response.data;
        console.log(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles:', error);
      }
    },
    getRoleName(role_id) {
      if (!this.roles || !Array.isArray(this.roles)) return 'Unknown';
      const role = this.roles.find(r => r.id === role_id);
      return role ? role.name : 'Unknown';
    },
    getRoleBadgeClass(role_id) {
      if (!this.roles || !Array.isArray(this.roles)) return 'badge-secondary';
      const role = this.roles.find(r => r.id === role_id);
      return role ? role.badge_class : 'badge-secondary'; // Remplacez 'badge_class' par la classe CSS réelle si nécessaire
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
        }, 3000); // Hide notification after 3 seconds
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
        role: '',
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
                    <i class="mdi mdi-plus me-1"></i> Ajouter un utilisateur
                  </BButton>
                </div>
              </BCol>
            </BRow>
          <div class="table-responsive">
            
            <BRow>
              <BCol xl="3" md="6" v-for="(user, index) in Users" :key="index">
                <BCard no-body>
                    <BCardBody>
                        <div class="d-flex align-start mb-3">
                            <div class="flex-grow-1">
                              <span class="badge" :class="getRoleBadgeClass(user.role_id)">{{ getRoleName(user.role_id) }}</span>
                            </div>
                            <BButton variant="light" type="button" class="btn-sm like-btn" data-bs-toggle="button"></BButton>
                        </div>
                        <div class="text-center mb-3">
                            <img :src="candidatesData.image" alt="" class="avatar-sm rounded-circle" />
                            <h6 class="font-size-15 mt-3 mb-1">{{ user.name }}</h6>
                            <p class="text-muted font-size-13 mb-0">{{ user.email }}</p>          
                        </div>
                                
                        <div class="mt-4 pt-1 ">
                          <div class="text-center mb-3">
                            <ul class="list-unstyled hstack gap-1 mb-0">
                            <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Edit">
                            <BLink href="#" @click=" editUser(user)" class="btn btn-sm btn-soft-info"><i class="mdi mdi-pencil-outline"></i></BLink>
                            </li>
                            <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete">
                            <BLink href="#" @click="deleteUser(user.id)" class="btn btn-sm btn-soft-danger"><i class="mdi mdi-delete-outline"></i></BLink>
                            </li>
                            </ul>
                          </div>
                        </div>
                    </BCardBody>
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
    <BModal v-model="showCreateModal" title="Ajouter nouveau utilisateur" title-class="font-18" body-class="p-3" hide-footer class="v-modal-custom">
      <BForm @submit.prevent="createUser">
        <BRow>
          <BCol cols="12">
            <div class="mb-3">
              <label for="name">Nom</label>
              <input id="name" v-model="newUser.name" type="text" class="form-control" placeholder="" />
              <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="email">Email</label>
              <input id="email" v-model="newUser.email" type="email" class="form-control" placeholder="" />
              <div v-if="errors.email" class="text-danger">{{ errors.email[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="password">Password</label>
              <input id="password" v-model="newUser.password" type="password" class="form-control" placeholder="" />
              <div v-if="errors.password" class="text-danger">{{ errors.password[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="role">Rôle</label>
              <select id="role" v-model="newUser.role_id" class="form-control">
                  <option v-for="role in Roles" :key="role.id" :value="role.id">{{ role.name }}</option>
              </select>
              <div v-if="errors.role" class="text-danger">{{ errors.role[0] }}</div>
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
