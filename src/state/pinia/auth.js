import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("authClient", {
    state: () => ({
        currentUser: null,
        loggedIn: false,
    }),
    getters: {
        isLoggedIn() {
            return !!this.currentUser;
        }
    },
    actions: {
        async logIn({ email, password, role }) {
            try {
                const response = await axios.post("http://127.0.0.1:8000/api/login", { email, password, role });
                if (response.data.status === "success") {
                    this.authSuccess = response.data.message;
                    this.isAuthSuccess = true;
                    this.setUser(response.data.user);
                    localStorage.setItem('authToken', response.data.access_token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem("userRole", response.data.user.role[0]);

                    const redirectRoute = this.redirectRouteBasedOnRole();
                    return redirectRoute;
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error("Login error:", error);
                throw error;
            }
        },
        setUser(user) {
            this.currentUser = user;
            this.loggedIn = true;
            this.saveState("authClient.currentUser", user);
        },
        saveState(key, state) {
            window.sessionStorage.setItem(key, JSON.stringify(state));
        },
        logOut() {
            this.currentUser = null;
            this.loggedIn = false;
            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("user");
            axios.defaults.headers.common['Authorization'] = null;
        },
        redirectRouteBasedOnRole() {
            if (this.currentUser && this.currentUser.role) {
                const role = this.currentUser.role[0];
                switch (role) {
                    case 'Admin':
                        return 'default';
                    case 'Chef Comptable':
                        return 'page facturedetail';
                    case 'Comptable':
                        return 'page facturelist';
                    case 'Client':
                        return 'Creer une Facture';    
                    default:
                        return 'default';
                }
            }
            return 'default';
        }
    }
});
