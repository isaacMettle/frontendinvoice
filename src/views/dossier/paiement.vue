<script setup>
import { onMounted, ref } from 'vue';
import Layout from '../../layouts/main';
import PageHeader from '@/components/page-header';

const montant = ref('');
const description = ref('');
const nomClient = ref('');
const emailClient = ref('');
const paymentStatus = ref('');

const loadCinetPayScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.cinetpay.com/seamless/main.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load CinetPay SDK'));
    document.head.appendChild(script);
  });
};

const initierPaiement = () => {
  if (!montant.value || !nomClient.value || !emailClient.value) {
    alert('Veuillez remplir tous les champs nécessaires.');
    return;
  }

  if (window.CinetPay) {
    const CinetPay = window.CinetPay;
    
    // Inspectez les méthodes disponibles
    console.log('Méthodes disponibles sur CinetPay:', Object.keys(CinetPay));

    // Ajustez le code selon la documentation ou les méthodes disponibles
    CinetPay.setConfig({
      apikey: 'VOTRE_API_KEY_ICI',
      site_id: 'VOTRE_SITE_ID_ICI',
      mode: 'PRODUCTION',
    });

    // Si setSignatureData n'existe pas, trouvez l'alternative dans la documentation
    if (typeof CinetPay.setSignatureData === 'function') {
      CinetPay.setSignatureData({
        amount: montant.value,
        trans_id: Date.now().toString(),
        currency: 'XOF',
        designation: description.value,
        custom: nomClient.value,
      });
    } else {
      console.error('Méthode setSignatureData non trouvée sur CinetPay.');
    }

    CinetPay.on('error', function (e) {
      alert('Erreur de paiement: ' + e.message);
    });

    CinetPay.on('signature', function (token) {
      console.log('Token reçu: ' + token);
    });

    CinetPay.on('payment', function (response) {
      if (response.status === 'ACCEPTED') {
        paymentStatus.value = 'Paiement réussi!';
      } else {
        paymentStatus.value = 'Paiement échoué : ' + response.message;
      }
    });

    CinetPay.sendData();
  } else {
    alert('CinetPay SDK non chargé.');
  }
};


onMounted(async () => {
  try {
    await loadCinetPayScript();
    console.log('CinetPay SDK chargé avec succès.');
    console.log('CinetPay:', window.CinetPay);  // Inspectez l'objet CinetPay
  } catch (error) {
    console.error(error);
  }
});

</script>

<template>
   <Layout>
     <PageHeader title="Effectuer un paiement" pageTitle="Clients" />
     <div class="payment-form">
       <form @submit.prevent="initierPaiement">
         <div>
           <label for="montant">Montant :</label>
           <input v-model="montant" type="text" id="montant" required />
         </div>
         <div>
           <label for="description">Description :</label>
           <input v-model="description" type="text" id="description" required />
         </div>
         <div>
           <label for="nomClient">Nom du client :</label>
           <input v-model="nomClient" type="text" id="nomClient" required />
         </div>
         <div>
           <label for="emailClient">Email du client :</label>
           <input v-model="emailClient" type="email" id="emailClient" required />
         </div>
         <button type="submit">Payer</button>
       </form>
       <p v-if="paymentStatus">{{ paymentStatus }}</p>
     </div>
   </Layout>
 </template>
 
<style scoped>
.payment-form {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.payment-form label {
  display: block;
  margin-bottom: 8px;
}
.payment-form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.payment-form button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.payment-form button:hover {
  background-color: #45a049;
}
</style>


