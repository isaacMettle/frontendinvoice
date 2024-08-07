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
  ok-only 
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
      />
    </BFormGroup>

    <BFormGroup label="Mot de passe" label-for="user-password">
      <BFormInput
        id="user-password"
        v-model="newUser.password"
        type="password"
        required
        placeholder="Entrez le mot de passe"
      />
    </BFormGroup>

    <BFormGroup label="Rôle" label-for="user-role">
      <BFormSelect
        id="user-role"
        v-model="newUser.role_id"
        required
      >
        <option value="">Sélectionner un rôle</option>
        <option v-for="role in Roles" :key="role.id" :value="role.id">
          {{ role.name }}
        </option>
      </BFormSelect>
    </BFormGroup>  
  </BForm>

  <BRow>
    <BCol>
      <BButton variant="success" class="w-lg" >Créer</BButton>
    </BCol>
  </BRow>
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
<!--div class="table-responsive">




<BCol lg="12">
              <BCard no-body>
                <BCardBody class="pb-0">
                  <BCardTitle>Articles facture</BCardTitle>
                  <div class="mt-2 text-end">
                    <BButton variant="primary" class="me-1" @click="showCreateModal = true">Ajouter une nouvelle ligne</BButton>
                  </div>
  
                  <BCol sm="6" md="4" xl="3">
                    <div class="my-4 text-center">
                    <BModal id="modal-xl" size="xl" title="Ajouter des produits" v-model="showCreateModal" title-class="font-18" hide-footer>
                      <div class="modal-body">
                        <ul class="product-list">
                          <li v-for="(item, index) in produit" :key="item.id" class="product-item">
                            <div class="product-field">
                              <strong>Numéro</strong>
                              <p>{{ index + 1 }}</p>
                            </div>
                            <div class="product-field">
                              <strong>Nom</strong>
                              <p>{{ item.name }}</p>
                            </div>
                            <div class="product-field">
                              <strong>Description</strong>
                              <p>{{ item.description }}</p>
                            </div>
                            <div class="product-field">
                              <button @click="addCart(item)" class="add-button">
                                <i class="mdi mdi-plus"></i> 
                              </button>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </BModal>
                    </div>
                  </BCol>









                    <BTableSimple class="table-custom mb-0">
                      <BThead>
                        <BTr>
                          <BTh class="text-nowrap">Item</BTh>
                          <BTh class="text-nowrap">Description</BTh>
                          <BTh class="text-nowrap"></BTh>
                          <BTh class="text-nowrap"></BTh>
                          <BTh class="text-nowrap">Prix unitaire</BTh>
                          <BTh class="text-nowrap">Quantité</BTh>
                          <BTh class="text-nowrap">Total</BTh>
                          <BTh class="text-nowrap">Action</BTh>
                        </BTr>
                      </BThead>
                      <BTbody>
                        <BTr v-for="(itemcart, i) in form.items" :key="itemcart.id">
                          <BTh scope="row" class="text-nowrap" v-if="itemcart.product">{{ itemcart.product.item_code }}</BTh>
                          <BTd class="text-nowrap">{{ itemcart.product.description }}</BTd>
                          <BTd class="text-nowrap"></BTd>
                          <BTd class="text-nowrap"></BTd>
                          <BTd class="text-nowrap">
                            <input 
                              type="text" 
                              class="form-control" 
                              v-model="itemcart.prix_unitaire" 
                              @input="sub_total(i)"
                              placeholder="0.00"
                              required
                            >
                            <div v-if="!itemcart.price" class="text-danger">Veuillez entrer le prix unitaire.</div>
                          </BTd>
                          <BTd class="text-nowrap">
                            <input 
                              type="number" 
                              class="form-control" 
                              v-model.number="itemcart.quantity" 
                              @input="sub_total(i)"
                              min="1"
                              step="1"
                              placeholder="0"
                              required
                            >
                            <div v-if="!itemcart.quantity" class="text-danger">Veuillez entrer la quantité.</div>
                          </BTd>
                          <BTd class="text-nowrap">{{ itemcart.quantity * itemcart.prix_unitaire }}</BTd>
                          <BTd class="text-nowrap">
                          <ul class="list-unstyled hstack gap-1 mb-0">
                           
                            <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Delete">
                              <BLink href="#" @click="deleteInvoiceItem(itemcart.id,i)" class="btn btn-sm btn-soft-danger">
                                <i class="mdi mdi-delete-outline"></i>
                              </BLink>
                            </li>
                          </ul>
                        </BTd>
                        </BTr>
                        <BTr>
                          <BRow>
                            <BCol sm="6">
                              <div class="mb-3">
                                <label for="email-text">Texte Email</label>
                                <textarea id="email-text" v-model="form.email_text" name="email-text" class="form-control" rows="8" cols="500"></textarea>
                              </div>
                            </BCol>
                            <BCol sm="6">
                              <div class="mb-3">
                                <label for="somme">Total</label>
                                <input id="somme" v-model="somme" name="somme" placeholder="Somme" type="text" class="form-control" readonly />
                              </div>
                              <div class="mb-3">
                                <label for="discount">Remise</label>
                                <input 
                                  id="discount" 
                                  v-model.number="discount" 
                                  name="discount" 
                                  placeholder="Discount" 
                                  type="number" 
                                  class="form-control" 
                                  @input="applyDiscount"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <div class="mb-3">
                                <label for="total">Total après remise</label>
                                <input id="total" v-model="total" name="total" placeholder="Total" type="text" class="form-control" readonly />
                              </div>
                            </BCol>
                          </BRow>
                          <BCol mb="12">
                            <div class="mt-2 text-end">
                              <BButton variant="success" class="w-lg" @click="onSave()">Enregistrer la facture</BButton>
                            </div>
                          </BCol>
                        </BTr>
                      </BTbody>
                    </BTableSimple>
                  </div-->