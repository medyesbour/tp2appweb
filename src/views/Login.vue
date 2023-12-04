<template>
    <div>
      <section class="section">
        <div class="container">
          <h1 class="title">Se connecter</h1>
          <div class="columns is-centered">
            <div class="column is-half">
              <form @submit.prevent="login">
                <div class="field">
                  <label class="label">Email</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Email"
                      v-model="email"
                    />
                  </div>
                </div>
                <div class="field">
                  <label class="label">Mot de passe</label>
                  <div class="control">
                    <input
                      class="input"
                      type="password"
                      placeholder="Mot de passe"
                      v-model="password"
                    />
                  </div>
                </div>
                <br>
                <p v-if="messError" class="has-text-danger">{{ messError }}</p>
                <div class="field">
                  <div class="control">
                    <button class="button is-primary">Se connecter</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const router = useRouter();
      const messError = ref();
  
      const login = async () => {
        try {
          const auth = getAuth();
          await signInWithEmailAndPassword(auth, email.value, password.value);
          messError.value = '';
          router.push('/tasks');
        } catch (error) {
          console.log(error.code);
          switch (error.code) {
            case 'auth/invalid-email':
              messError.value = 'Email invalide';
              break;
            case 'auth/user-disabled':
              messError.value = 'Utilisateur désactivé';
              break;
            case 'auth/user-not-found':
              messError.value = 'Utilisateur non trouvé';
              break;
            case 'auth/wrong-password':
              messError.value = 'Mot de passe incorrect';
              break;
          }
        }
      };
  
      return {
        email,
        password,
        login,
        messError,
      };
    },
  };
  </script>
  