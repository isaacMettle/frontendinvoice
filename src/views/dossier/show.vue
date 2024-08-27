<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { ref, onMounted, defineProps } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const router = useRouter();

const props = defineProps({
    id: {
        type: String,
        default: ''
    }
});

const form = ref({ id:'' });
let invoices = ref([]);

const getInvoice = async () => {
    try {
        console.log('Fetching invoice with ID:', props.id);
        let response = await axios.get(`http://127.0.0.1:8000/api/show_invoice/${props.id}`);
        console.log('form', response.data.invoice);
        form.value = response.data.invoice;
    } catch (error) {
        console.error('Erreur lors de la récupération des éléments de la facture:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la récupération des éléments de la facture.',
        });
    }
};

const updateApprobation = async (status) => {
  try {
    await axios.put(`http://127.0.0.1:8000/api/updateInvoice/${form.value.id}`, {
      approbation: status
    });
    console.log('Approbation mise à jour avec succès');
    await getInvoices1();
    Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Approbation mise à jour avec succès.',
    });
    //router.push('facturedetail');
    // Optionally, redirect to the list page or show a success message
    //router.push('/facturedetail').catch(() => {});
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'approbation:', error);
    Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la mise à jour de l\'approbation.',
    });
  }
};

const getInvoices1 = async () => {
  try {
    let response = await axios.get('http://127.0.0.1:8000/api/listInvoice');
    invoices.value = response.data.invoices;
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la récupération des factures.',
    });
  }
};

const print = () =>{
  window.print();
  Swal.fire({
      icon: 'info',
      title: 'Impression',
      text: 'La facture est prête à être imprimée.',
  });
  router.push('/').catch(()=>{})
}

onMounted(() => {
    if (props.id) {
        getInvoice();
    } else {
        console.error('No ID provided');
    }
});
</script>


<template>
  <Layout>
    <PageHeader title="Detail" pageTitle="Invoices" />

    <BRow>
      <BCol lg="12">
        <BCard no-body>
          <BCardBody>
            <div class="invoice-title">
              <h4 class="float-end font-size-16">{{ form.invoice_number }}</h4>
              <div class="mb-4">
                <img src="@/assets/images/wequipu.jpg" alt="logo" height="90" />
              </div>
            </div>
            <hr />
            <BRow>
              <BCol cols="6">
                <address>
                  <strong>Nom:</strong> {{ form.client?.name }}
                  <br /><strong>NIF:</strong> {{ form.client?.NIF }}
                  <br /><strong>ADRESSE:</strong> {{ form.client?.address }}
                  <br /><strong>Email:</strong> {{ form.client?.email }}
                </address>
              </BCol>
              
              <BCol cols="6" class="mt-3 text-sm-end">
                <address>
                  <strong>Date:</strong> {{ form.date }}
                  <br />
                </address>
              </BCol>
            </BRow>
            
            <div class="table-responsive">
              <BTableSimple>
                <BThead>
                  <BTr>
                    <BTh style="width: 70px">No.</BTh>
                    <BTh>Item</BTh>
                    <BTh>name</BTh>
                    <BTh>Description</BTh>
                    <BTh>Prix unitaire</BTh>
                    <BTh>Quantité</BTh>
                    <BTh>Total</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="(item, index) in form.items" :key="item.id">
                    <BTd>{{ index + 1 }}</BTd>
                    <BTd>{{ item.product.item_code }}</BTd>
                    <BTd>{{ item.product.name }}</BTd>
                    <BTd>{{ item.product.description }}</BTd>
                    <BTd>{{ item.prix_unitaire }}</BTd>
                    <BTd>{{ item.quantity }}</BTd>
                    <BTd>{{ item.prix_unitaire * item.quantity }}</BTd>
                  </BTr>

                  <BTr>
                    <BTd colspan="4" class="border-0 text-sm-end">
                      <strong>Remise</strong>
                    </BTd>
                    <BTd class="border-0 text-sm-end">{{ form.discount }}</BTd>
                  </BTr>
                  <BTr>
                    <BTd colspan="4" class="border-0 text-sm-end">
                      <strong>Total apres remise</strong>
                    </BTd>
                    <BTd class="border-0 text-sm-end">
                      <h4 class="m-0">{{ form.total }}</h4>
                    </BTd>
                  </BTr>
                </BTbody>
              </BTableSimple>
            </div>
           
            <div class="d-print-none d-flex align-items-center">
              <BButton class="me-2" variant="warning" @click="updateApprobation('non approuver')">Non approuver</BButton>
              <BButton class="me-2" variant="success" @click="updateApprobation('approuver')">Approuver</BButton>
              <BLink class="btn btn-success waves-effect waves-light" @click="print()"><i class="fa fa-print"></i></BLink>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

