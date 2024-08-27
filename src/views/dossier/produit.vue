<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  components: { Layout, PageHeader },
  name: 'produitList',
  data() {
    return {
      produit: [],
      categories: [],
      showModal: false,
      showCreateModal: false,
      showCreateCategoryModal: false,
      showEditModal: false,
      newProduits: {
        name: '',
        description: '',
        price: '',
        category_id: '',
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
    this.fetchcategory();
  },
  methods: {
    async fetchproduit() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listProduct');
        this.produit = response.data;
      } catch (error) {
        Swal.fire('Erreur', 'Erreur lors de la récupération des produits', 'error');
      }
    },

    async fetchcategory() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listCategories');
        this.categories = response.data;
      } catch (error) {
        Swal.fire('Erreur', 'Erreur lors de la récupération des catégories', 'error');
      }
    },

    async createProduit() {
      this.errors = {};
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/AddProducts', this.newProduits);
        Swal.fire('Succès', 'Produit créé avec succès', 'success');
        console.log('Produit created successfully:', response.data);
        this.fetchproduit();
        this.showModal = false;
        this.resetNewProduitForm();
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
          Swal.fire('Erreur', 'Erreur lors de la création du produit', 'error');
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
        Swal.fire('Succès', 'Produit mis à jour avec succès', 'success');
        console.log('Produit mis à jour avec succès:', response.data);
        this.fetchproduit();
        this.showEditModal = false;
        this.resetEditProduitForm();
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
          Swal.fire('Erreur', 'Erreur lors de la mise à jour du produit', 'error');
        }
      }
    },

    async deleteProduct(id) {
      const result = await Swal.fire({
        title: 'Confirmation',
        text: 'Voulez-vous vraiment supprimer ce produit ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/deleteProducts/${id}`);
          Swal.fire('Succès', 'Produit supprimé avec succès', 'success');
          this.fetchproduit();
        } catch (error) {
          Swal.fire('Erreur', 'Erreur lors de la suppression du produit', 'error');
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
                  <BButton variant="primary" class="me-1" @click="showModal = !showModal">Ajouter un produit</BButton>                 
                  <router-link to="/dossier/category">
                    <BButton variant="primary" class="me-1" >Ajouter une catégorie</BButton>                    
                  </router-link>
                </div>
              </BCol>
            </BRow>
            <div class="table-responsive">
          <BTableSimple class="table-custom table-striped table-hover table-bordered">
            <BThead>
              <BTr>
                <BTh>Numero</BTh>
                <BTh>Code</BTh>
                <BTh>Produit</BTh>
                <BTh>Description</BTh>
                <BTh>Prix</BTh>
                <BTh>Action</BTh>
              </BTr>
            </BThead>
            <BTbody>
              <BTr v-for="(prod, index) in produit" :key="index">
                <BTd>{{ index + 1 }}</BTd>
                <BTd>{{ prod.item_code }}</BTd>
                <BTd>{{ prod.name }}</BTd>
                <BTd>{{ prod.description }}</BTd>
                <BTd>{{ prod.price }}</BTd>
                <BTd class="text-center"> <!-- Center text within the table cell -->
                  <ul class="list-unstyled d-flex justify-content-center align-items-center gap-1 mb-0">
                    <li>
                      <BButton class="btn-custom" variant="success" @click="editProduit(prod)" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
                        <i class="mdi mdi-pencil d-block font-size-16"></i> Edit
                      </BButton>
                    </li>
                    <li>
                      <BButton class="btn-custom" variant="danger" @click="deleteProduct(prod.id)" style="padding: 0.2rem 0.4rem; font-size: 0.75rem;">
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

    <!-- Modal for creating a new product -->
    <BModal
  v-model="showModal"
  title="Ajouter un nouveau produit"
  title-class="font-18"
  body-class="p-3"
  hide-footer
  class="v-modal-custom"
>
  <BForm @submit.prevent="createProduit">
    <BRow>
      <BCol cols="12">
        <div class="mb-3">
          <label for="name">Nom</label>
          <input
            id="name"
            v-model="newProduits.name"
            type="text"
            class="form-control"
            placeholder="Entrez le nom du produit"
            required
          />
          <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
        </div>
      </BCol>
      <BCol cols="12">
        <div class="mb-3">
          <label for="description">Description</label>
          <input
            id="description"
            v-model="newProduits.description"
            type="text"
            class="form-control"
            placeholder="Entrez une description"
            required
          />
          <div v-if="errors.description" class="text-danger">{{ errors.description[0] }}</div>
        </div>
      </BCol>
      <BCol cols="12">
        <div class="mb-3">
          <label for="price">Prix</label>
          <input
            id="price"
            v-model="newProduits.price"
            type="number"
            class="form-control"
            placeholder="Entrez le prix du produit"
            required
          />
          <div v-if="errors.price" class="text-danger">{{ errors.price[0] }}</div>
        </div>
      </BCol>
      <BCol cols="12">
        <div class="mb-3">
          <label for="category">Catégorie</label>
          <select
            id="category"
            v-model="newProduits.category_id"
            class="form-control"
            required
          >
            <option value="" disabled>Choisir une catégorie</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <div v-if="errors.category" class="text-danger">{{ errors.category[0] }}</div>
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
    <BModal
  v-model="showEditModal"
  title="Modifier le produit"
  title-class="font-18"
  body-class="p-3"
  hide-footer
  class="v-modal-custom"
>
  <BForm @submit.prevent="updateProduit">
    <BRow>
      <BCol cols="12">
        <div class="mb-3">
          <label for="edit-name">Nom</label>
          <input
            id="edit-name"
            v-model="editProductData.name"
            type="text"
            class="form-control"
            placeholder="Entrez le nom du produit"
            required
          />
          <div v-if="errors && errors.name" class="text-danger">{{ errors.name[0] }}</div>
        </div>
      </BCol>
      <BCol cols="12">
        <div class="mb-3">
          <label for="edit-description">Description</label>
          <input
            id="edit-description"
            v-model="editProductData.description"
            type="text"
            class="form-control"
            placeholder="Entrez une description"
            required
          />
          <div v-if="errors && errors.description" class="text-danger">{{ errors.description[0] }}</div>
        </div>
      </BCol>
      <BCol cols="12">
        <div class="mb-3">
          <label for="edit-price">Prix</label>
          <input
            id="edit-price"
            v-model="editProductData.price"
            type="number"
            class="form-control"
            placeholder="Entrez le prix du produit"
            required
          />
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

<style scoped>
/* Custom styles for the table */
.table-custom {
  border-radius: 8px;
  overflow: hidden;
}

.table-custom thead th {
  background-color: purple;
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
