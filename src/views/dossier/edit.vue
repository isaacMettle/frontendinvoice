<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';
import { useRouter } from "vue-router";
import { ref, onMounted, defineProps, nextTick } from 'vue';
import Swal from 'sweetalert2';  // Import SweetAlert2

const router = useRouter();
const clients = ref([]);
const produit = ref([]);
const listCart = ref([]);
const showCreateModal = ref(false);
const today = new Date().toISOString().split('T')[0];
const somme = ref(0);
const discount = ref(0);
const total = ref(0);

let form = ref({
  id: '',
});

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});

const getInvoice = async () => {
  try {
    console.log('Fetching invoice with ID:', props.id);
    let response = await axios.get(`http://127.0.0.1:8000/api/edit_invoice/${props.id}`);
    form.value = response.data.invoice;
    discount.value = form.value.discount || 0;
    listCart.value = form.value.items.map(item => ({
      product_id: item.product.id,
      id: item.id,
      item_code: item.product.item_code,
      description: item.product.description,
      price: item.product.price,
      quantity: item.quantity,
      total: item.product.price * item.quantity
    }));
    Total();
  } catch (error) {
    console.error('Erreur lors de la sélection de la facture:', error);
    Swal.fire('Erreur', 'Erreur lors de la récupération de la facture.', 'error');
  }
};

const indexForm = async () => {
  try {
    let response = await axios.get('http://127.0.0.1:8000/api/create_invoice');
    form.value = response.data;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du formulaire:', error);
    Swal.fire('Erreur', 'Erreur lors de l\'initialisation du formulaire.', 'error');
  }
};

const addCart = (item) => {
  const itemcart = {
    product_id: item.id,
    id: item.id,
    item_code: item.item_code,
    description: item.description,
    price: item.price,
    quantity: item.quantity,
    total: 0
  };
  listCart.value.push(itemcart);
  showCreateModal.value = false;
  Swal.fire('Ajouté!', 'Article ajouté au panier.', 'success');
};

const sub_total = (index) => {
  const itemcart = listCart.value[index];
  itemcart.total = itemcart.price * itemcart.quantity;
  Total();
};

const Total = () => {
  somme.value = listCart.value.reduce((acc, item) => acc + item.total, 0);
  applyDiscount();
};

const applyDiscount = () => {
  total.value = somme.value - discount.value;
};

const validateCartItems = () => {
  if (listCart.value.length === 0) {
    Swal.fire('Attention', 'Le panier est vide, ajoutez au moins un article.', 'warning');
    return false;
  }
  for (const item of listCart.value) {
    if (!item.product_id || !item.price || !item.quantity) {
      Swal.fire('Erreur', 'Chaque article de la facture doit contenir un identifiant de produit, un prix et une quantité.', 'error');
      return false;
    }
  }
  return true;
};

onMounted(() => {
  fetchClients();
  fetchProduit();
  indexForm();
  if (props.id) {
    getInvoice();
  } else {
    console.error('No ID provided');
    Swal.fire('Erreur', 'Aucun ID fourni.', 'error');
  }
});

const fetchClients = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/listClient');
    clients.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    Swal.fire('Erreur', 'Erreur lors de la récupération des clients.', 'error');
  }
};

const fetchProduit = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/listProduct');
    produit.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    Swal.fire('Erreur', 'Erreur lors de la récupération des produits.', 'error');
  }
};

const deleteInvoiceItem = async (id, index) => {
  form.value.items.splice(index, 1);
  await nextTick();
  if (id !== undefined) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deleteInvoiceItems/${id}`);
      Swal.fire('Supprimé!', 'L\'article a été supprimé avec succès.', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      Swal.fire('Erreur', 'Erreur lors de la suppression de l\'article.', 'error');
    }
  }
};

const onEdit = async () => {
  form.value.items = listCart.value;
  if (form.value.items.length >= 1) {
    if (!form.value.client_id || !form.value.due_date) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    if (validateCartItems()) {
      Total();
      const formData = new FormData();
      formData.append('invoice_number', form.value.invoice_number);
      formData.append('sub_total', somme.value);
      formData.append('total', total.value);
      formData.append('discount', discount.value);
      formData.append('client_id', form.value.client_id);
      formData.append('date', form.value.date);
      formData.append('due_date', form.value.due_date);
      formData.append('email_text', form.value.email_text);
      formData.append('note', form.value.note);
      formData.append('invoice_item', JSON.stringify(form.value.items));

      try {
        await axios.post(`http://127.0.0.1:8000/api/modifier_invoice/${form.value.id}`, formData);
        form.value.items = [];
        listCart.value = [];
        Swal.fire('Succès', 'La facture a été mise à jour avec succès.', 'success');
        router.push('facturelist');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la facture:', error);
        Swal.fire('Erreur', 'Erreur lors de la sauvegarde de la facture.', 'error');
      }
    }
  } else {
    Swal.fire('Erreur', 'Le panier est vide. Ajoutez au moins un article.', 'error');
  }
};

</script>



<style scoped>
.product-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-item {
  display: grid;
  grid-template-columns: 60px 150px 1fr 50px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  gap: 20px;
}

.product-field {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.product-field strong {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.add-button {
  border: 1px solid #e0e0e0;
  width: 35px;
  height: 35px;
  cursor: pointer;
  background-color: rgb(23, 40, 188);
  font-size: 18px;
  line-height: 35px;
  text-align: center;
}

.add-button:hover {
  background-color: #f0f0f0;
}
 
</style>

<template>
  <Layout>
    <PageHeader title="Modifier une facture" pageTitle="Comptable" />
    <BRow>
      <BCol cols="12">
        <BCard>
          <BCard no-body>
            <BCardTitle>Informations de la facture</BCardTitle>
            <p class="card-title-desc">Sélectionnez d'abord le client</p>

            <BForm>
              <BRow>
                <BCol sm="6">
                  <div class="mb-3">
                    <label for="client-select">Clients</label>
                    <b-form-select 
                      id="client-select" 
                      v-model="form.client_id" 
                      :options="clients.map(client => ({ value: client.id, text: client.name }))" 
                      @change="handleClientChange" 
                      placeholder="Sélectionner un client"
                      required
                    ></b-form-select>
                    <div v-if="!form.client_id" class="text-danger">Veuillez sélectionner un client.</div>
                  </div>
                  <div class="mb-3">
                    <label for="date">Date</label>
                    <input id="date" v-model="form.date" type="date" :min="today" class="form-control" />
                  </div>
                  <div class="mb-3">
                    <label for="dateecheance">Date échéance</label>
                    <input
                      id="dateecheance"
                      v-model="form.due_date"
                      name="dateecheance"
                      type="date"
                      class="form-control"
                      :min="today"
                      required
                    />
                    <div v-if="!form.due_date" class="text-danger">Veuillez entrer une date d'échéance.</div>
                  </div>
                </BCol>
                <BCol sm="6">
                  <div class="mb-3">
                    <label for="invoice_number">Numéro</label>
                    <input id="invoice_number" v-model="form.invoice_number" name="invoice_number" type="text" class="form-control" />
                  </div>
                  <div class="mb-3">
                    <label for="reference">Référence (Optionnel)</label>
                    <input id="reference" v-model="form.note" name="reference" type="text" class="form-control" />
                  </div>
                </BCol>
              </BRow>
            </BForm>
          </BCard>
        </BCard>

        <BRow>
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

    <div class="table-responsive">
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
            <BTr v-for="(itemcart, i) in listCart" :key="itemcart.id">
                <BTh scope="row" class="text-nowrap">{{ itemcart.item_code }}</BTh>
                <BTd class="text-nowrap">{{ itemcart.description }}</BTd>
                <BTd class="text-nowrap"></BTd>
                <BTd class="text-nowrap"></BTd>
                <BTd class="text-nowrap">
                    <input 
                        type="text" 
                        class="form-control" 
                        v-model="itemcart.price" 
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
                <BTd class="text-nowrap">{{ itemcart.total }}</BTd>
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
                          <div class="mt-2 text-end"  >
                            <BButton variant="success" class="w-lg" @click="onEdit(form.id)">Enregistrer la facture</BButton>
                          </div>
                        </BCol>
                      </BTr>
                    </BTbody>
                  </BTableSimple>
                </div>

              </BCardBody>
            </BCard>
          </BCol>
        </BRow>
      </BCol>
    </BRow>
  </Layout>
</template>

<style scoped>
.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button i {
  margin-right: 4px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: flex;
  gap: 16px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.product-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-field strong {
  font-weight: bold;
}

</style>