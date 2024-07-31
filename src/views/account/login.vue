<script>
import Layout from "../../layouts/auth";
import axios from 'axios';
import { ref } from 'vue';

export default {
  components: {
    Layout,
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const isAuthError = ref(false);
    const authError = ref('');
    const notification = ref({ message: '', type: '' });
    const submitted = ref(false);

    const tryToLogIn = async () => {
      submitted.value = true;
      isAuthError.value = false;
      authError.value = '';

      if (!email.value || !password.value) {
        authError.value = 'Email et mot de passe sont requis';
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
          email: email.value,
          password: password.value,
        });

        // Utilisation de la réponse
        const user = response.data.user;

        notification.value = {
          message: 'Connexion réussie',
          type: 'alert-success'
        };

        // Stocker les informations de l'utilisateur dans le localStorage ou une autre méthode
        localStorage.setItem('user', JSON.stringify(user));

        // Rediriger vers une autre page après une connexion réussie, si nécessaire
        // this.$router.push('/dashboard');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          authError.value = 'Email ou mot de passe incorrect';

          notification.value = {
          message: 'Email ou mot de passe incorrect',
          type: 'alert-danger'
        };


        } else {
          authError.value = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        }
      }
    };

    return {
      email,
      password,
      tryToLogIn,
      isAuthError,
      authError,
      notification,
      submitted,
    };
  }
};
</script>

<template>
  <Layout>
    <BRow class="justify-content-center">
      <BCol md="8" lg="6" xl="5">
        <BCard no-body class="overflow-hidden">
          <div class="bg-primary-subtle">
            <BRow>
              <BCol cols="7">
                <div class="text-primary p-4">
                  <h5 class="text-primary">Bienvenue !</h5>
                  <p>Connectez-vous pour continuer.</p>
                </div>
              </BCol>
              <BCol cols="5" class="align-self-end">
                <img src="@/assets/images/profile-img.png" alt class="img-fluid" />
              </BCol>
            </BRow>
          </div>
          <BCardBody class="pt-0">
            <div>
              <router-link to="/">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-light">
                    <img src="@/assets/images/logo.svg" alt height="34" />
                  </span>
                </div>
              </router-link>
            </div>
            <BAlert v-if="isAuthError" variant="danger" class="mt-3" dismissible>{{ authError }}</BAlert>
            <div v-if="notification.message" :class="'alert ' + notification.type">
              {{ notification.message }}
            </div>

            <BForm class="p-2" @submit.prevent="tryToLogIn">
              <BFormGroup class="mb-3" id="input-group-1" label="Email" label-for="input-1">
                <BFormInput id="input-1" v-model="email" type="text" placeholder="Enter email" :class="{
                  'is-invalid': submitted && !email,
                }"></BFormInput>
                <div v-if="submitted && !email" class="invalid-feedback">
                  <span>Email est requis</span>
                </div>
              </BFormGroup>

              <BFormGroup class="mb-3" id="input-group-2" label="Password" label-for="input-2">
                <BFormInput id="input-2" v-model="password" type="password" placeholder="Enter password" :class="{
                  'is-invalid': submitted && !password,
                }"></BFormInput>
                <div v-if="submitted && !password" class="invalid-feedback">
                  <span>Mot de passe est requis</span>
                </div>
              </BFormGroup>
              
              <div class="mt-3 d-grid">
                <BButton type="submit" variant="primary" class="btn-block">Log In</BButton>
              </div>
              
            </BForm>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>
