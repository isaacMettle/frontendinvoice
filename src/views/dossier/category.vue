<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';

export default {
  components: { Layout, PageHeader, },
  name: 'produitList',
  data() {
    return {
      categories: [],
      showModal: false,
      showCreateModal: false,
      showCreateCategoryModal:false,
      showEditModal: false,
     

      newCategories: {
        name: '',  
      },

      errors: {},

      /*editProductData: {
        id: null,
        name: '',
       description '',
        price '',
      },*/

    };

  },
  mounted() {
    this.fetchcategory();
  },
  methods: {
    async fetchcategory() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listCategories');
        console.log('API Response:', response.data); // Log de la réponse
        this.categories = response.data;

      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    },

   

    async createCategorie() {
      this.errors = {};
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/AddCategories', this.newCategories);     
            this.fetchcategory();
            this.showCreateModal = false;
            this.resetNewCategoryForm();
            // this.resetNewProductForm();
            console.log('Category created successfully:', response.data);
         

      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
        }
      }
    },
     resetNewCategoryForm() {
       this.newProduits = {
         name: '',
       };
     },
    /*async updateClient() {
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
    
    resetEditClientForm() {
      this.editClientData = {
        id: null,
        name: '',
        NIF: '',
        email: '',
        address: '',
      };
    }*/
  },
};
</script>


<template>
  <Layout>
    <PageHeader title="Liste des categories" pageTitle="Produits" />
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
                  <!--BButton variant="success" class="btn-rounded mb-2 me-2" @click="showModal = !showModal">
                    <i class="mdi mdi-plus me-1"></i> Ajouter un produit
                  </BButton-->
                  <BButton variant="success" class="btn-rounded mb-2 me-2" @click=" showCreateCategoryModal=!showCreateCategoryModal">
                    <i class="mdi mdi-plus me-1"></i> Ajouter
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
                    <BTh>Action</BTh>
                    
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="(cat, index) in categories" :key="index">
                    <BTd>{{ index + 1 }}</BTd>
                    <BTd>{{ cat.name }}</BTd>
                    
                    <BTd>
                      <ul class="list-unstyled hstack gap-1 mb-0">
                        <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Edit">
                          <BLink href="#" @click="editClient(prod)" class="btn btn-sm btn-soft-info"><i
                              class="mdi mdi-pencil-outline"></i></BLink>
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

    <!-- Modal for creating a new product -->
    <!--BModal v-model="showModal" title="Ajouter un nouveau produit" title-class="font-18" body-class="p-3"
      hide-footer class="v-modal-custom">
      <BForm @submit.prevent="createProduit">
        <BRow>
          <BCol cols="12">
            <div class="mb-3">
              <label for="name">Nom</label>
              <input id="name" v-model="newProduits.name" type="text" class="form-control" placeholder="" />
              <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="description">Description</label>
              <input id="description" v-model="newProduits.description" type="text" class="form-control"
                placeholder="" />
              <div v-if="errors.description" class="text-danger">{{ errors.description[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="price">Prix</label>
              <input id="price" v-model="newProduits.price" type="number" class="form-control" placeholder="" />
              <div v-if="errors.price" class="text-danger">{{ errors.price[0] }}</div>
            </div>
          </BCol>
        </BRow>
        <div class="text-end pt-5 mt-3">
          <BButton variant="light" @click="showModal = false">Fermer</BButton>
          <BButton type="submit" variant="success" class="ms-1">Enregistrer</BButton>
        </div>
      </BForm>
    </BModal-->

    <BModal v-model="showCreateModal" title="Ajouter une nouvelle categorie" title-class="font-18" body-class="p-3"
      hide-footer class="v-modal-custom">
      <BForm @submit.prevent="createCategorie">
        <BRow>
          <BCol cols="12">
            <div class="mb-3">
              <label for="name">Nom</label>
              <input id="name" v-model="newCategories.name" type="text" class="form-control" placeholder="" />
              <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
            </div>
          </BCol>
          
        </BRow>
        <div class="text-end pt-5 mt-3">
          <BButton variant="light" @click="showCreateCategoryModal = false">Fermer</BButton>
          <BButton type="submit" variant="success" class="ms-1">Enregistrer</BButton>
        </div>
      </BForm>
    </BModal>
  </Layout>
</template>


