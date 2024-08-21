<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';

export default {
  components: { Layout, PageHeader },
  name: 'categoryList',
  data() {
    return {
      categories: [],
      showCreateCategoryModal: false,
      showEditModal: false,
      newCategory: {
        name: '',
      },
      editCategory: {
        id: '',
        name: '',
      },
      errors: {},
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listCategories');
        this.categories = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    },
    async createCategory() {
      this.errors = {};
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/AddCategories', this.newCategory);
        this.fetchCategories();
        this.showCreateCategoryModal = false;
        this.resetNewCategoryForm();
        console.log('Catégorie créée avec succès:', response.data);
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
        }
      }
    },
    async updateCategory() {
      this.errors = {};
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/updateCategories/${this.editCategory.id}`, this.editCategory);
        this.fetchCategories();
        this.showEditModal = false;
        console.log('Catégorie mise à jour avec succès:', response.data);
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors || {};
        }
      }
    },
    async deleteCategory(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/deleteCategories/${id}`);
          this.fetchCategories();
          console.log('Catégorie supprimée avec succès');
        } catch (error) {
          console.error('Erreur lors de la suppression de la catégorie:', error);
        }
      }
    },
    resetNewCategoryForm() {
      this.newCategory = {
        name: '',
      };
    },
    openEditModal(category) {
      this.editCategory = { ...category };
      this.showEditModal = true;
    },
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Liste des catégories" pageTitle="Catégories" />
    <BRow>
      <BCol cols="12">
        <BCard no-body>
          <BCardBody>
            <BRow class="mb-2">
              <BCol sm="4">
                <div class="search-box me-2 mb-2 d-inline-block">
                  <div class="position-relative">
                    <input type="text" class="form-control" placeholder="Rechercher..." />
                    <i class="bx bx-search-alt search-icon"></i>
                  </div>
                </div>
              </BCol>
              <BCol sm="8">
                <div class="text-sm-end">
                  <BButton variant="success" class="btn-rounded mb-2 me-2" @click="showCreateCategoryModal = true">
                    <i class="mdi mdi-plus me-1"></i> Ajouter
                  </BButton>
                </div>
              </BCol>
            </BRow>
            <div class="table-responsive">
              <BTableSimple class="table-centered table-nowrap align-middle">
                <BThead>
                  <BTr>
                    <BTh>Numéro</BTh>
                    <BTh>Nom</BTh>
                    <BTh>Action</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="(category, index) in categories" :key="index">
                    <BTd>{{ index + 1 }}</BTd>
                    <BTd>{{ category.name }}</BTd>
                    <BTd>
                      <ul class="list-unstyled hstack gap-1 mb-0">
                        <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Modifier">
                          <BLink href="#" @click="openEditModal(category)" class="btn btn-sm btn-soft-info">
                            <i class="mdi mdi-pencil-outline"></i>
                          </BLink>
                        </li>
                        <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Supprimer">
                          <BLink href="#" @click="deleteCategory(category.id)" class="btn btn-sm btn-soft-danger">
                            <i class="mdi mdi-delete-outline"></i>
                          </BLink>
                        </li>
                      </ul>
                    </BTd>
                  </BTr>
                </BTbody>
              </BTableSimple>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- Modal for creating a new category -->
    <BModal v-model="showCreateCategoryModal" title="Ajouter une nouvelle catégorie" title-class="font-18" body-class="p-3"
      hide-footer class="v-modal-custom">
      <BForm @submit.prevent="createCategory">
        <BRow>
          <BCol cols="12">
            <div class="mb-3">
              <label for="name">Nom</label>
              <input id="name" v-model="newCategory.name" type="text" class="form-control" placeholder="Nom de la catégorie" />
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

    <!-- Modal for editing a category -->
    <BModal v-model="showEditModal" title="Modifier la catégorie" title-class="font-18" body-class="p-3" hide-footer class="v-modal-custom">
      <BForm @submit.prevent="updateCategory">
        <BRow>
          <BCol cols="12">
            <div class="mb-3">
              <label for="edit-name">Nom</label>
              <input id="edit-name" v-model="editCategory.name" type="text" class="form-control" placeholder="Nom de la catégorie" />
              <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
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
