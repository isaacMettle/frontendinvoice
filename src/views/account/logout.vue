<template>
  <div>
    <a v-if="item.action === 'logout'" @click.prevent="handleLogout">
    <i :class="item.icon"></i> {{ item.label }}
</a>

  </div>
</template>

<script>
import { useAuthStore } from "@/state/pinia/auth";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    // Automatically handle the logout when the component is mounted
    const handleLogout = async () => {
      try {
        await authStore.logOut();
        router.push('/login'); // Redirect to the login page after logging out
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    handleLogout(); // Call the logout function when the component is loaded

    return {
      handleLogout
    };
  }
};
</script>
