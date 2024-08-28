<script>
import { avatar3, avatar4, avatar1 } from "@/assets/images/users/data";
import { useAuthStore } from '@/state/pinia';
import i18n from "../i18n";
import { useRouter } from 'vue-router';

export default {
  setup() {
        const router = useRouter();
        const auth = useAuthStore()

        const handleLogout = () => {
          const role = localStorage.getItem('userRole');
          if (role) {
              localStorage.setItem('tempUserRole', role.trim());
          }
          console.log('Role before logout:', role);
          auth.logOut();
          const redirectLink = getLogoutLink();
          console.log('Redirecting to:', redirectLink); // Pour vérifier la redirection
          router.push(redirectLink);
      };

    const getLogoutLink = () => {
    const role = localStorage.getItem('tempUserRole')?.trim(); // Utilisez .trim() pour éliminer les espaces

    console.log('Role fetched from localStorage:', role); // Pour vérifier la valeur

              if (role === 'Admin') {
                  return '/login';
              } else if (role === 'Client') {
                  return '/loginclient';
              } else if (role === 'Chef Comptable') {
                  return '/login';
              } else if (role === 'Comptable') {
                  return '/login';
              } else {
                  return '/';
              }
          };


        return {
            handleLogout,
        };
    },
  data() {
    return {
      lang: "en",
      lan: i18n.locale,
      text: null,
      flag: null,
      value: null,
      avatar3, avatar4, avatar1,
      languages: [
        {
          flag: require("@/assets/images/flags/us.jpg"),
          language: "en",
          title: "English",
        },
        {
          flag: require("@/assets/images/flags/french.jpg"),
          language: "fr",
          title: "French",
        },
        {
          flag: require("@/assets/images/flags/spain.jpg"),
          language: "es",
          title: "Spanish",
        },
        {
          flag: require("@/assets/images/flags/chaina.png"),
          language: "zh",
          title: "Chinese",
        },
        {
          flag: require("@/assets/images/flags/arabic.png"),
          language: "ar",
          title: "Arabic",
        },
      ],
      locales: ["fr", "en", "ar"]
    };
  },
  mounted() {
    if (process.env.VUE_APP_I18N_LOCALE) {
      this.flag = this.$i18n.locale || process.env.VUE_APP_I18N_LOCALE;
      this.languages.forEach((item) => {
        if (item.language == this.flag) {
          document.getElementById("header-lang-img")?.setAttribute("src", item.flag);
        }
      });
    }
  },
  computed: {
    currentUser() {
      return useAuthStore().currentUser;
    }
  },
  methods: {
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    
    

    userBadgeColor(role) {
      // Définir les couleurs pour chaque rôle
      const colors = {
        'Admin': 'bg-primary', // Couleur pour Admin
        'Chef Comptable': 'bg-success', // Couleur pour Chef Comptable
        'Comptable': 'bg-warning', // Couleur pour Comptable
        'Client': 'bg-info' // Couleur pour Client
      };
      return colors[role] || 'bg-secondary'; // Couleur par défaut
    },

    
  }
};
</script>


<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <router-link to="/" class="logo logo-dark">
            <span class="logo-sm">
              <img src="@/assets/images/logo.svg" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-dark.png" alt height="17" />
            </span>
          </router-link>

          <router-link to="/" class="logo logo-light">
            <span class="logo-sm">
              <img src="@/assets/images/logo-light.svg" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/wequipu.jpg" alt height="30" />
            </span>
          </router-link>
        </div>

        <BButton variant="white" id="vertical-menu-btn" type="button" class="btn btn-sm px-3 font-size-16 header-item" @click="toggleMenu">
          <i class="fa fa-fw fa-bars"></i>
        </BButton>
      </div>

      <div class="d-flex">
      <BDropdown right variant="black" toggle-class="header-item" menu-class="dropdown-menu-end">
        <template v-slot:button-content>
          <img class="rounded-circle header-profile-user" :src="avatar1" alt="Header Avatar" />
          <span class="d-none d-xl-inline-block ms-1">
            <div v-if="currentUser">
              <span :class="['badge', userBadgeColor(currentUser.role), 'bg-primary', 'text-white', 'p-2', 'rounded']">
                {{ currentUser.displayName }}
                <small class="text-muted">({{ currentUser.role }})</small> <!-- Affichage du rôle -->
              </span>
            </div>
            <div v-else>
              <span class="badge bg-secondary p-2 rounded">Utilisateur</span>
            </div>
          </span>
          <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
        </template>

        <BDropdownDivider></BDropdownDivider>
        <a href="#" class="dropdown-item text-danger" @click.prevent="handleLogout">
          <i class="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i>
          {{ $t("navbar.dropdown.henry.list.logout") }}
        </a>
      </BDropdown>
    </div>

    </div>
  </header>
</template>

<style scoped>
.badge {
  padding: 0.5em 1em;
  border-radius: 0.25em;
  font-size: 0.875em;
  color: #fff;
  display: inline-block;
}

.bg-primary {
  background-color: #007bff;
}

.bg-success {
  background-color: #28a745;
}

.bg-warning {
  background-color: #ffc107;
}

.bg-info {
  background-color: #17a2b8;
}

.bg-secondary {
  background-color: #6c757d;
}

.custom-badge {
  background-color: #007bff; /* bleu par défaut de Bootstrap */
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 14px;
}


</style>
