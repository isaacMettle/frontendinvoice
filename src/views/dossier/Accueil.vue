<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/login'); // Redirige vers la page de connexion
};

const goToClientArea = () => {
  router.push('/client'); // Redirige vers l'espace client
};
</script>

<template>
  <!-- En-tête de la page -->
  <div class="header">
    <h1>Bienvenue dans notre Application de Facturation</h1>
    <p>Gérez vos factures facilement et rapidement.</p>

    <!-- Sections de navigation -->
    <div class="navigation-buttons">
      <button @click="goToLogin">Connexion</button>
      <button @click="goToClientArea">Espace Client</button>
    </div>
  </div>

  <!-- Section des fonctionnalités principales -->
  <div class="features-section">
    <h2>Fonctionnalités principales</h2>
    <div class="features-cards">
      <div class="feature-card">
        <img src="@/assets/images/invoice.jpg" alt="Création de Factures" class="feature-image">
        <h3>Création de Factures</h3>
        <p>Créez des factures professionnelles en quelques clics avec des modèles personnalisables et des options de personnalisation.</p>
      </div>
      <div class="feature-card">
        <img src="@/assets/images/payment.jpg" alt="Suivi des Paiements" class="feature-image">
        <h3>Suivi des Paiements</h3>
        <p>Surveillez les paiements en temps réel, recevez des notifications pour les paiements en retard et suivez les transactions de manière efficace.</p>
      </div>
      <div class="feature-card">
        <img src="@/assets/images/clients.jpg" alt="Gestion des Clients" class="feature-image">
        <h3>Gestion des Clients</h3>
        <p>Organisez et gérez facilement votre liste de clients avec des informations détaillées et un historique des factures.</p>
      </div>
      <div class="feature-card">
        <img src="@/assets/images/report.jpg" alt="Rapports" class="feature-image">
        <h3>Rapports</h3>
        <p>Générez des rapports détaillés pour une meilleure analyse financière et des prises de décisions éclairées.</p>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <p>&copy; 2024 Application de Facturation. Tous droits réservés.</p>
  </footer>
</template>

<style scoped>
/* Style général de la page */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

/* En-tête */
.header {
  text-align: center;
  color: white;
  padding: 60px 20px;
  background-image: url('@/assets/images/background.jpg');
  background-size: cover;
  background-position: center;
  margin-bottom: 30px;
  position: relative;
  height: 70vh; /* Prendre plus de la moitié de la page */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header h1 {
  z-index: 1;
  margin: 0;
  font-size: 36px; /* Augmenter la taille du texte */
}

.header p {
  z-index: 1;
  margin: 10px 0;
  font-size: 18px; /* Augmenter la taille du texte */
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Filtre sombre pour le texte */
  z-index: 0;
}

/* Boutons de navigation */
.navigation-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
  position: relative;
  z-index: 1;
}

.navigation-buttons button {
  padding: 15px 30px;
  font-size: 18px;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.navigation-buttons button:hover {
  background-color: #45a049;
}

/* Section des fonctionnalités */
.features-section {
  margin: 20px;
  text-align: center;
}

.features-section h2 {
  font-size: 28px; /* Augmenter la taille du texte */
}

.features-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.feature-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  width: 250px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  text-align: left;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  margin-top: 0;
  color: #4CAF50;
  font-size: 20px; /* Augmenter la taille du texte */
}

.feature-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
}

/* Footer */
.footer {
  text-align: center;
  padding: 20px 0;
  background-color: #333;
  color: white;
  width: 100%; /* Assurer que le footer prenne toute la largeur */
  position: fixed; /* Faire en sorte que le footer reste en bas de la page */
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
