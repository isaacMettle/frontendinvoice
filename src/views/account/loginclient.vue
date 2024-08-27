<script>
import Layout from "../../layouts/auth";
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useAuthStore } from "../../state/pinia/auth";
import { useNotificationStore } from '@/state/pinia'

const notificationStore = useNotificationStore();

export default {
    setup() {
        return {
            v$: useVuelidate(),
        };
    },

    components: {
        Layout,
    },
    data() {
        return {
            email: "",
            password: "",
            isPasswordVisible: false,
            submitted: false,
            authSucces: false,
            isAuthSucces: false,
            authError: null,
            tryingToLogIn: false,
            isAuthError: false,
            role: null
        };
    },
    validations: {
        email: {
            required: helpers.withMessage("Email is required", required),
        },
        password: {
            required: helpers.withMessage("Password is required", required),
        },
    },
    computed: {
        notification() {
            return notificationStore || {};
        },
    },
    created() {
        const userRole = localStorage.getItem('userRole');
        console.log('User role from local storage:', userRole);
        if (userRole) {
            this.userRole = userRole;
        }
    },
    methods: {
        async tryToLogIn() {
            this.submitted = true;
            this.authError = null;
            this.isAuthError = false;
            this.authSucces = null;
            this.isAuthSucces = false;

            this.v$.$touch();

            if (this.v$.$invalid) {
                return;
            } else {
                try {
                    const authStore = useAuthStore();
                    const redirectRoute = await authStore.logIn({ email: this.email, password: this.password, role: this.role });
                    /*const userRole = localStorage.getItem('userRole');
                    console.log('User role from local storage:', userRole);
                    if (userRole !== 'Client') {
                        // Si l'utilisateur n'est pas un client, déconnectez-le et redirigez-le vers une page 403
                        authStore.logOut();
                        this.$router.push({ name: 'page404' });
                        return;
                    }*/
                    this.authSucces = "Connexion réussie";
                    this.isAuthSucces = true;
                    this.isAuthError = false;
                    this.$router.push({ name: redirectRoute });
                } catch (error) {
                    console.error("Login error: ", error);
                    this.authError = "Email ou mot de passe invalide";
                    this.isAuthError = true;
                    this.isAuthSucces = false;
                }
            }
        }
    },
};
</script>

<template>
    <Layout>
        <div class="full-page-background"></div>
        <div class="content-container">
            <BRow class="justify-content-center align-items-center" style="min-height: 100vh;">
            <BCol md="10" lg="8" xl="8">
                <BCard no-body class="overflow-hidden">
                    <BRow no-gutters>
                        <!-- Image section -->
                        <BCol md="6" class="p-0">
                            <img src="@/assets/images/client.jpg" alt="Login Image" class="img-fluid w-100 h-100" style="object-fit: cover;">
                        </BCol>
                        
                        <!-- Form section -->
                        <BCol md="6" class="p-5 d-flex flex-column justify-content-center bg-white">
                            <div class="text-center mb-4">
                                <h4>Bienvenue chers client(e)</h4>
                                <p class="mb-0">Merci de vous connecter</p>
                            </div>

                            <!-- Notification alerts -->
                            <BAlert v-if="isAuthError" v-model="isAuthError" variant="danger" class="mt-3" dismissible>
                                {{ authError }}
                            </BAlert>

                            <BAlert v-if="isAuthSucces" v-model="isAuthSucces" variant="success" class="mt-3" dismissible>
                                {{ authSucces }}
                            </BAlert>

                            <!-- Notification message -->
                            <div v-if="notification.message" :class="'alert ' + notification.type">
                                {{ notification.message }}
                            </div>

                            <!-- Login form -->
                            <BForm @submit.prevent="tryToLogIn">
                                <BFormGroup label="Email" label-for="email-input" class="mb-3">
                                    <BFormInput
                                        id="email-input"
                                        v-model="email"
                                        type="email"
                                        placeholder="Enter email"
                                        :class="{'is-invalid': submitted && v$.email.$error}"
                                    ></BFormInput>
                                    <div v-for="(item, index) in v$.email.$errors" :key="index" class="invalid-feedback">
                                        <span v-if="item.$message">{{ item.$message }}</span>
                                    </div>
                                </BFormGroup>

                                <BFormGroup label="Password" label-for="password-input" class="mb-3">
                                    <div class="input-group">
                                        <BFormInput
                                            id="password-input"
                                            v-model="password"
                                            :type="isPasswordVisible ? 'text' : 'password'"
                                            placeholder="Enter password"
                                            :class="{'is-invalid': submitted && v$.password.$error}"
                                        />
                                        <button type="button" class="btn btn-outline-secondary" @click="isPasswordVisible = !isPasswordVisible">
                                            <i :class="isPasswordVisible ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
                                        </button>
                                    </div>
                                    <div v-if="submitted && v$.password.$error" class="invalid-feedback">
                                        <span v-if="v$.password.required.$message">{{ v$.password.required.$message }}</span>
                                    </div>
                                </BFormGroup>

                                <BButton type="submit" variant="primary" class="btn-block mt-3">Log In</BButton>
                                <div class="mt-4 text-center">
                                    <router-link to="/forgot-password" class="text-muted">
                                        <i class="mdi mdi-lock me-1"></i> Forgot your password?
                                    </router-link>
                                </div>
                            </BForm>
                        </BCol>
                    </BRow>
                </BCard>
            </BCol>
        </BRow>
        </div>
       
    </Layout>
</template>

<style>
html, body {
    height: 100%;
    margin: 0;
}

.full-page-background {
    position: fixed; /* Utilisez `fixed` pour rester en place lors du défilement */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/blue.jpg'); /* Chemin vers votre image */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -1; /* Assurez-vous que l'image est en arrière-plan */
}

.content-container {
    position: relative; /* Assurez-vous que le contenu est au-dessus de l'image */
    z-index: 1;
}
</style>




