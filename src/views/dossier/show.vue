<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { ref, onMounted, defineProps } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';

const router = useRouter();

const props = defineProps({
    id: {
        type: String,
        default: ''
    }
});

const form = ref({ id:'' });



const getInvoice = async () => {
    try {
        console.log('Fetching invoice with ID:', props.id);
        let response = await axios.get(`http://127.0.0.1:8000/api/show_invoice/${props.id}`);
        console.log('form', response.data.invoice);
        form.value = response.data.invoice;
    } catch (error) {
        console.error('Erreur lors de la récupération des elements de la facture:', error);
    }
};

const print = () =>{
  window.print()
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
              <h4 class="float-end font-size-16">Order # {{ form.invoice_number }}</h4>
              <div class="mb-4">
                <img src="@/assets/images/logo-dark.png" alt="logo" height="20" />
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
                  <strong>Order Date:</strong> {{ form.date }}
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
            <div class="d-print-none">
              <div class="float-end">
                <BLink  class="btn btn-success waves-effect waves-light me-1" @click="print()"><i class="fa fa-print"></i></BLink>
                <BLink href="#" class="btn btn-primary w-md waves-effect waves-light ms-1">Send</BLink>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>
