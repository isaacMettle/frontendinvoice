<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  components: { Layout, PageHeader },
  setup() {
    const generateInvoiceNumber = () => {
      const prefix = 'FA';
      const id = Math.floor(Math.random() * 10000); // Utiliser un identifiant basé sur le temps pour la démonstration
      const suffix = new Date().getFullYear();
      return `${prefix}-${id}-${suffix}`;
    };

    const clients = ref([]);
    const invoices = ref([]);
    const produit = ref([]);
    const selectedProduct = ref(null);
    const quantity = ref(0);
    const total = ref(0);
    const price = ref(0);
    

    const showCreateModal = ref(false);

    const selectedClientId = ref(null);
    const editClientData = ref({
      id: null,
      name: '',
      NIF: '',
      email: '',
      address: '',
    });
    const invoiceForm = ref({
      id: '',
      invoice_number: generateInvoiceNumber(),
      date: '',
      due_date: '',
      note: '',
      email_text: '',
      client_id: ''
    });
   
    const product = ref({
      id: '',
      name: '',
      price: '',
      quantity: '',
      total: '',
    });
    const errors = ref({});

    onMounted(() => {
      fetchClients();
      fetchFacture();
      fetchProduit();
    });

    const updatePrice = () => {
      const product = produit.value.find(p => p.id === selectedProduct.value);
      if (product) {
        price.value = product.price;
        calculateTotal();
      }
    };

    const calculateTotal = () => {
      const product = produit.value.find(p => p.id === selectedProduct.value);
      if (product) {
        total.value = product.price * quantity.value;
      }
    };

    const calculateTotal2 = () => {
      product.value.total = (product.value.price * product.value.quantity).toFixed(2);
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listClient');
        clients.value = response.data;
        console.log(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error);
      }
    };

    const fetchProduit = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listProduct');
        produit.value = response.data;
        console.log(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    };

    

    const fetchFacture = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/listInvoice/');
        invoices.value = response.data;
        console.log(response);
      } catch (error) {
        console.error('Error lors de la recuperation de la facture:', error);
      }
    };

    /*const createFacture = async () => {
      errors.value = {};
      try {
        invoiceForm.value.client_id = selectedClientId.value;
        const response = await axios.post('http://127.0.0.1:8000/api/AddInvoices', invoiceForm.value);
        const createdInvoice = response.data;
        console.log('Invoice created successfully:', createdInvoice);
         // Set the invoice_id in itemForm to the ID of the created invoice
        itemForm.value.invoice_id = createdInvoice.id;
        const itemResponse = await axios.post('http://127.0.0.1:8000/api/AddInvoiceItems', itemForm.value);
        showCreateModal.value = false;
        resetItemForm();
        console.log('Ligne Facture created successfully:', itemResponse.data);
        fetchFacture();
        showCreateModal.value = false;
        resetInvoiceForm();
      } catch (error) {
        if (error.response) {
          errors.value = error.response.data.errors || {};
        }
      }

      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/updateClients/${editClientData.value.id}`, editClientData.value);
        fetchClients();
        showCreateModal.value = false;
        resetEditClientForm();
        console.log('Client created successfully:', response.data);
      } catch (error) {
        if (error.response) {
          errors.value = error.response.data.errors || {};
        }
      }
    };*/


    const createFacture = async () => {
      errors.value = {};
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/AddProducts/`, product.value);
        fetchProduit();
        showCreateModal.value = false;
        resetProductForm();
        console.log('product created successfully:', response.data);
      } catch (error) {
        if (error.response) {
          errors.value = error.response.data.errors || {};
        }
      }
    }

    const editClient = (clientId) => {
      const client = clients.value.find(c => c.id === clientId);
      editClientData.value = { ...client };
      showCreateModal.value = true;
    };

    const resetInvoiceForm = () => {
      invoiceForm.value = {
        invoice_number: generateInvoiceNumber(),
        date: '',
        due_date: '',
        note: '',
        email_text: '',
        client_id: ''
      };
    };

    const resetItemForm = () => {
      product.value = {
    invoice_id: '',
    description: '',
    prix_unitaire: '',
    tva: '',
    total: '',
    quantity: '',
  };
};

const resetProductForm = () => {
  product.value = {
    id: '',
    name: '',
    price: '',
    quantity: '',
    total: '',
  };
}
    const resetEditClientForm = () => {
      editClientData.value = {
        id: null,
        name: '',
        NIF: '',
        email: '',
        address: '',
      };
    };

    return {
      clients,
      invoices,
      produit,
      showCreateModal,
      selectedClientId,
      editClientData,
      invoiceForm,
      product,
      errors,
      calculateTotal,
      fetchClients,
      fetchProduit,     
      fetchFacture,
      generateInvoiceNumber,
      createFacture,
      editClient,
      resetInvoiceForm,
      resetItemForm,
      resetEditClientForm,
      resetProductForm,
      selectedProduct,
      price,
      quantity,
      total,
      updatePrice,
      calculateTotal2,
    };
  }
};
</script>

<template>
  <Layout>
    <PageHeader title="Créer une facture" pageTitle="Comptable" />
    <BRow>
      <BCol cols="12">
        <BCard>
          <BCard no-body>
            <BCardTitle>Basic Information</BCardTitle>
            <p class="card-title-desc">Fill all information below</p>

            <BForm >
              <BRow>
                <BCol sm="6">
            <div class="mb-3">
              <label for="productname">Product Name</label>
              <b-form-select
                id="productname"
                v-model="selectedProduct"
                :options="produit.map(p => ({ value: p.id, text: p.name }))"
                @change="updatePrice"
                class="form-control"
              ></b-form-select>
            </div>
            <div class="mb-3">
              <label for="price">Price</label>
              <input
                id="price"
                v-model="price"
                name="price"
                placeholder="Price"
                type="text"
                class="form-control"
                readonly
              />
            </div>
            <div class="mb-3">
              <label for="quantity">Quantity</label>
              <input
                id="quantity"
                v-model="quantity"
                name="quantity"
                placeholder="Quantity"
                type="number"
                class="form-control"
                @input="calculateTotal"
              />
            </div>
            <div class="mb-3">
              <label for="total">Total</label>
              <input
                id="total"
                v-model="total"
                name="total"
                placeholder="Total"
                type="text"
                class="form-control"
                readonly
              />
            </div>
          </BCol>
               
                <BCol sm="6">
                
                  <div class="mb-3">
                    <label for="client-select">Client</label>
                    <b-form-select  id="client-select" v-model="selectedClientId" :options="clients.map(client => ({ value: client.id, text: client.name }))"  @change="editClient(selectedClientId)" placeholder="Select"></b-form-select>  
                  
                  </div> 
                  <div class="mb-3">
                    <label for="date">Date</label>
                    <input id="date" v-model="clients.date" name="date" type="date" :min="today" class="form-control" />
                  </div>
                  <div class="mb-3">
                    <label for="dateecheance">Date echeance</label>
                    <input id="dateecheance" v-model="clients.dateecheance" name="dateecheance" type="date" class="form-control" />
                  </div>
                  <div class="mb-3">
                    <label for="note">Note</label>
                    <textarea
                      id="note"
                      v-model="invoiceForm.note"
                      class="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                  <!--div class="mb-3">
                    <label for="name">Nom</label>
                    <input id="name"  v-model="editClientData.name" type="text"  class="form-control"  placeholder="" />
                    <div v-if="submitted && v$.editClientData.name.$error" class="invalid-feedback">
                      <span v-if="v$.editClientData.name.required.$message">{{
                        v$.editClientData.name.required.$message
                      }}</span>
                    </div>
                  </div>

                   <div class="mb-3">
                    <label for="NIF">NIF</label>
                    <input id="NIF"  v-model="editClientData.NIF" type="text"  class="form-control"  placeholder="" />
                    <div v-if="submitted && v$.editClientData.NIF.$error" class="invalid-feedback">
                      <span v-if="v$.editClientData.NIF.required.$message">{{
                        v$.editClientData.NIF.required.$message
                      }}</span>
                    </div>
                  </div>
                   <div class="mb-3">
                    <label for="email">Email</label>
                    <input id="email"  v-model="editClientData.email" type="text"  class="form-control"  placeholder="" />
                    <div v-if="submitted && v$.editClientData.email.$error" class="invalid-feedback">
                      <span v-if="v$.editClientData.email.required.$message">{{
                        v$.editClientData.email.required.$message
                      }}</span>
                    </div>
                  </div>

                   <div class="mb-3">
                    <label for="address">Adresse</label>
                    <input id="address"  v-model="editClientData.address" type="text"  class="form-control"  placeholder="" />
                    <div v-if="submitted && v$.editClientData.address.$error" class="invalid-feedback">
                      <span v-if="v$.editClientData.address.required.$message">{{
                        v$.editClientData.address.required.$message
                      }}</span>
                    </div>
                  </div-->
                </BCol>
              </BRow>
              <div class="mt-2">
                <BButton variant="primary" class="me-1">
                 Ajouter
                </BButton>
                <BButton variant="secondary">Cancel</BButton>
              </div>
            </BForm>
          </BCard>
        </BCard>
        <!--debut-->
        <BCard no-body>
          <BRow>
      <BCol lg="12">
        <BCard no-body>
          <BCardBody>
            <div class="invoice-title">
              <h4 class="float-end font-size-16">Order # 12345</h4>
              <div class="mb-4">
                <h1>FACTURE</h1>
                <!--img src="@/assets/images/logo-dark.png" alt="logo" height="20" /-->
              </div>
            </div>
            <hr />
            <BRow>
              <BCol cols="6">
                <address>
                  <strong>Billed To:</strong>
                  <br />John Smith <br />1234 Main <br />Apt. 4B
                  <br />Springfield, ST 54321
                </address>
              </BCol>
              <BCol cols="6" class="text-sm-end">
                <address>
                  <strong>Shipped To:</strong>
                  <br />Kenny Rigdon <br />1234 Main <br />Apt. 4B
                  <br />Springfield, ST 54321
                </address>
              </BCol>
            </BRow>
            <BRow>
              <BCol cols="6" class="mt-3">
                <address>
                  <strong>Payment Method:</strong>
                  <br />Visa ending **** 4242 <br />jsmith@email.com
                </address>
              </BCol>
              <BCol cols="6" class="mt-3 text-sm-end">
                <address>
                  <strong>Order Date:</strong>
                  <br />October 16, 2019
                  <br />
                  <br />
                </address>
              </BCol>
            </BRow>
            <div class="p-2 mt-3">
              <h3 class="font-size-16">Order summary</h3>
            </div>
            <div class="table-responsive">
              <BTableSimple>
                <BThead>
                  <BTr>
                    <BTh style="width: 70px">No.</BTh>
                    <BTh>Item</BTh>
                    <BTh class="text-sm-end">Price</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr>
                    <BTd>01</BTd>
                    <BTd>Skote - Bootstrap 5 Admin Dashboard</BTd>
                    <BTd class="text-sm-end">$499.00</BTd>
                  </BTr>

                  <BTr>
                    <BTd>02</BTd>
                    <BTd>Skote - Bootstrap 4 Landing Template</BTd>
                    <BTd class="text-sm-end">$399.00</BTd>
                  </BTr>

                  <BTr>
                    <BTd>03</BTd>
                    <BTd>Veltrix - Bootstrap 4 Admin Template</BTd>
                    <BTd class="text-sm-end">$499.00</BTd>
                  </BTr>
                  <BTr>
                    <BTd colspan="2" class="text-sm-end">Sub Total</BTd>
                    <BTd class="text-sm-end">$1397.00</BTd>
                  </BTr>
                  <BTr>
                    <BTd colspan="2" class="border-0 text-sm-end">
                      <strong>Shipping</strong>
                    </BTd>
                    <BTd class="border-0 text-sm-end">$13.00</BTd>
                  </BTr>
                  <BTr>
                    <BTd colspan="2" class="border-0 text-sm-end">
                      <strong>Total</strong>
                    </BTd>
                    <BTd class="border-0 text-sm-end">
                      <h4 class="m-0">$1410.00</h4>
                    </BTd>
                  </BTr>
                </BTbody>
              </BTableSimple>
            </div>
            <div class="d-print-none">
              <div class="float-end">
                <BLink href="javascript:window.print()" class="btn btn-success waves-effect waves-light me-1"><i
                    class="fa fa-print"></i></BLink>
                <BLink href="#" class="btn btn-primary w-md waves-effect waves-light ms-1">Send</BLink>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
        </BCard>
        <!--fin-->

        <!--BCard no-body>
          <BCardBody>
            <BCardTitle>Meta Data</BCardTitle>
            <p class="card-title-desc">Fill all information below</p>
            <BForm>
              <BRow>
                <BCol sm="6">
                  <div class="mb-3">
                    <label for="metatitle">Meta title</label>
                    <input id="metatitle" name="productname" type="text" class="form-control" placeholder="Meta Title" />
                  </div>
                  <div class="mb-3">
                    <label for="metakeywords">Meta Keywords</label>
                    <input id="metakeywords" name="quantity" type="text" class="form-control" placeholder="Meta Keywords" />
                  </div>
                </BCol>

                <BCol sm="6">
                  <div class="mb-3">
                    <label for="metadescription">Meta Description</label>
                    <BFormTextarea id="metadescription" class="form-control" rows="5" placeholder="Meta Description"></BFormTextarea>
                  </div>
                </BCol>
              </BRow>

              <BButton variant="primary" class="me-1">
                Save Changes
              </BButton>
              <BButton variant="secondary">Cancel</BButton>
            </BForm>
          </BCardBody>
        </BCard-->
      </BCol>
    </BRow>
    <!--BContainer>
      <BForm @submit.prevent="createFacture">
        <BRow>
        
        
          <BCol md="6">
            <h4 class="mt-3 mb-2">Enregistrer la facture</h4>
            <BForm class="p-2">
              <BRow>
           
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="invoice_number">Numéro de facture</label>
                    <input
                      id="invoice_number"
                      v-model="invoiceForm.invoice_number"
                      type="text"
                      class="form-control"
                      readonly
                    />
                  </div>
                </BCol>
            
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="date">Date de facture</label>
                    <input
                      id="date"
                      v-model="invoiceForm.date"
                      type="date"
                      class="form-control"
                    />
                  </div>
                </BCol>
            
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="due_date">Date d'échéance</label>
                    <input
                      id="due_date"
                      v-model="invoiceForm.due_date"
                      type="date"
                      class="form-control"
                    />
                  </div>
                </BCol>
            
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="note">Note</label>
                    <textarea
                      id="note"
                      v-model="invoiceForm.note"
                      class="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                </BCol>
          
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="email_text">Texte de l'email</label>
                    <textarea
                      id="email_text"
                      v-model="invoiceForm.email_text"
                      class="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                </BCol>
              </BRow>
            </BForm>
          </BCol>

     
          <BCol md="6">
            <h4 class="mt-3 mb-2">Liste des clients</h4>
            <BForm @submit.prevent="createFacture" class="p-2">
              <BRow>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="client-select">Sélectionner un client</label>
                    <b-form-select
                      id="client-select"
                      v-model="selectedClientId"
                      :options="clients.map(client => ({ value: client.id, text: client.name }))"
                      @change="editClient(selectedClientId)"
                    ></b-form-select>
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="name">Nom</label>
                    <input
                      id="name"
                      v-model="editClientData.name"
                      type="text"
                      class="form-control"
                      placeholder=""
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="phone">NIF</label>
                    <input
                      id="phone"
                      v-model="editClientData.NIF"
                      type="text"
                      class="form-control"
                      placeholder=""
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="email">Email</label>
                    <input
                      id="email"
                      v-model="editClientData.email"
                      type="email"
                      class="form-control"
                      placeholder=""
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="address">Adresse</label>
                    <input
                      id="address"
                      v-model="editClientData.address"
                      type="text"
                      class="form-control"
                      placeholder=""
                    />
                  </div>
                </BCol>
              </BRow>
            </BForm>
          </BCol>


          <BCol md="6">
            <BForm @submit.prevent="createFacture" class="p-2">
              <BRow>
                <input type="hidden" :value="itemForm.invoice_id" />
                <BCol cols="12">
                  <h4 class="mt-3 mb-2">Ajouter des produits</h4>
                  
                  <div class="mb-3">
                    <label for="description">Description</label>
                    <input
                      id="description"
                      v-model="itemForm.description"
                      type="text"
                      class="form-control"
                      placeholder="Description du bien"
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="prix_unitaire">Prix unitaire</label>
                    <input
                      id="prix_unitaire"
                      v-model="itemForm.prix_unitaire"
                      @input="calculateTotal"
                      type="number"
                      step="0.01"
                      class="form-control"
                      placeholder="Prix unitaire"
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="tva">TVA</label>
                    <input
                      id="tva"
                      v-model="itemForm.tva"
                      type="number"
                      step="0.01"
                      class="form-control"
                      placeholder="TVA (%)"
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="quantity">Quantity</label>
                    <input
                      id="quantity"
                      v-model="itemForm.quantity"
                      @input="calculateTotal"
                      type="number"
                      step="0.01"
                      class="form-control"
                      placeholder="Quantity"
                    />
                  </div>
                </BCol>
                <BCol cols="12">
                  <div class="mb-3">
                    <label for="total">Total</label>
                    <input
                      id="total"
                      v-model="itemForm.total"
                      type="number"
                      step="0.01"
                      class="form-control"
                      placeholder="Total"
                      readonly
                    />
                  </div>
                </BCol>
              </BRow>
            </BForm>
          </BCol>
        </BRow>

        <div class="text-end pt-5 mt-3">
          <BButton type="submit" variant="success" class="ms-1">Enregistrer une facture</BButton>
        </div>

      </BForm>
    </BContainer-->
  </Layout>
</template>
