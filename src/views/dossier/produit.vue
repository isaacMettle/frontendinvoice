<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';

export default {
  components: { Layout, PageHeader },
  name: 'produitList',
  data() {
    return {
      produit: [],
      showModal: false,
      showCreateModal: false,
      showCreateCategoryModal: false,
      showEditModal: false,
      newProduits: {
        name: '',
        description: '',
        price: '',
      },
      newCategories: {
        name: '',
      },
      errors: {},
      editProductData: {
        id: null,
        name: '',
        description: '',
        price: '',
      },
    };
  },
  mounted() {
    this.fetchproduit();
  },
  methods: {
    async fetchproduit() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products-with-category-info');
        console.log('API Response:', response.data); // Log the response
        this.produit = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    },
    async createProduit() {
      this.errors = {};
      try {
        await axios.post('http://127.0.0.1:8000/api/AddProducts', this.newProduits)
          .then((response) => {
            this.fetchproduit();
            this.showCreateModal = false;
            this.newProduits = { name: '', description: '', price: '' };
            console.log('Product created successfully:', response.data);
          });
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
        }
      }
    },
    resetNewProduitForm() {
      this.newProduits = {
        name: '',
        description: '',
        price: '',
      };
    },
    async updateProduit() {
      this.errors = {};
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/updateProducts/${this.editProductData.id}`, this.editProductData);
        this.fetchproduit();
        this.showEditModal = false;
        this.resetEditProduitForm();
        console.log('Product updated successfully:', response.data);
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
        }
      }
    },
    editProduit(produit) {
      this.editProductData = { ...produit };
      this.showEditModal = true;
    },
    resetEditProduitForm() {
      this.editProductData = {
        id: null,
        name: '',
        description: '',
        price: '',
      };
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Liste des produits" pageTitle="Produits" />
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
                  <BButton variant="success" class="btn-rounded mb-2 me-2" @click="showModal = !showModal">
                    <i class="mdi mdi-plus me-1"></i> Ajouter un produit
                  </BButton>
                  <router-link to="/dossier/category">
                    <BButton variant="success" class="btn-rounded mb-2 me-2">
                      <i class="mdi mdi-plus me-1"></i> Ajouter une catégorie
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
                    <BTh>Produit</BTh>
                    <BTh>Catégorie</BTh>
                    <BTh>Description</BTh>
                    <BTh>Prix</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="(prod, index) in produit" :key="index">
                    <BTd>{{ index + 1 }}</BTd>
                    <BTd>{{ prod.name }}</BTd>
                    <BTd>{{ prod.category_name }}</BTd>
                    <BTd>{{ prod.description }}</BTd>
                    <BTd>{{ prod.price }}</BTd>
                    <BTd>
                      <ul class="list-unstyled hstack gap-1 mb-0">
                        <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Edit">
                          <BLink href="#" @click="editProduit(prod)" class="btn btn-sm btn-soft-info"><i class="mdi mdi-pencil-outline"></i></BLink>
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

    <!-- Modal for creating a new product -->
    <BModal v-model="showModal" title="Ajouter un nouveau produit" title-class="font-18" body-class="p-3" hide-footer class="v-modal-custom">
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
              <input id="description" v-model="newProduits.description" type="text" class="form-control" placeholder="" />
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
    </BModal>

    <!-- Modal for editing an existing product -->
    <BModal v-model="showEditModal" title="Modifier le produit" title-class="font-18" body-class="p-3" hide-footer class="v-modal-custom">
      <BForm @submit.prevent="updateProduit">
        <BRow>
          <BCol cols="12">
            <div class="mb-3">
              <label for="edit-name">Nom</label>
              <input id="edit-name" v-model="editProductData.name" type="text" class="form-control" placeholder="" />
              <div v-if="errors && errors.name" class="text-danger">{{ errors.name[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="edit-description">Description</label>
              <input id="edit-description" v-model="editProductData.description" type="text" class="form-control" placeholder="" />
              <div v-if="errors && errors.description" class="text-danger">{{ errors.description[0] }}</div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label for="edit-price">Prix</label>
              <input id="edit-price" v-model="editProductData.price" type="number" class="form-control" placeholder="" />
              <div v-if="errors && errors.price" class="text-danger">{{ errors.price[0] }}</div>
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
