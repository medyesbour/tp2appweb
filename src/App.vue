<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">Accueil</router-link>
        <router-link v-if="isLoggedIn" to="/tasks" class="navbar-item">Tâches</router-link>
        <router-link v-if="isLoggedIn" to="/completed-tasks" class="navbar-item">Tâches Complètes</router-link>
      </div>
  
      <div class="navbar-menu">
        <div class="navbar-end">
          <router-link v-if="!isLoggedIn" to="/login" class="navbar-item">Connexion</router-link>
          <router-link v-if="!isLoggedIn" to="/register" class="navbar-item">Inscription</router-link>
          <router-link to="/login" @click="logout" class="navbar-item" v-if="isLoggedIn" :class="{ 'logout-button': isLoggedIn }">Déconnexion</router-link>
        </div>
      </div>
    </nav>
    <router-view />
  </template>
  
  <style scoped>
  .navbar {
    background-color: #333;
  }
  
  .navbar-item {
    color: #fff;
    font-weight: bold;
  }
  
  .navbar-item:hover {
    background-color: #f00; /* Ajoutez la lueur rouge au survol */
    color: #fff;
    transition: background-color 0.3s ease-in-out;
  }
  
  .logout-button {
    /* Ajoutez une lueur rouge au bouton de déconnexion */
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
    color: #f00;
  }
  
  .logout-button:hover {
    background-color: transparent; /* Retirez la couleur de fond au survol */
    color: #fff;
  }
  </style>
  

<script>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const isLoggedIn = ref(false);
    const auth = getAuth();
    const router = useRouter();

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          isLoggedIn.value = true;
        } else {
          isLoggedIn.value = false;
        }
      });
    });

    const logout = async () => {
      signOut(auth).then(() => {
        router.push('/login');
      });
    };

    return {
      isLoggedIn,
      logout,
    };
  },
};
</script>