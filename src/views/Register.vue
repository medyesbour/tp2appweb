<template>
    <div>
      <section class="section">
        <div class="container">
          <h1 class="title">Créer un compte</h1>
          <div class="columns is-centered">
            <div class="column is-half">
              <form @submit.prevent="register">
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
                <div class="field">
                  <div class="control">
                    <button class="button is-primary">Créer le compte</button>
                  </div>
                  <br>
                </div>
              </form>
              <div>
                    <button class="button" @click="signInWithGoogle">S'inscrire avec Google</button>
                  </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const router = useRouter();
    
      const register = async () => {
        try {
          const auth = getAuth();
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
          );
          const user = userCredential.user;
          console.log('Compte créé avec succès', user);
          router.push('/tasks');
        } catch (error) {
          console.error('Erreur lors de la création du compte', error);
          alert(error.message);
        }
      };
  
      const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
          const auth = getAuth();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          console.log(user.displayName + " est connecté avec Google");
          router.push('/tasks');
        } catch (error) {
          console.error('Erreur lors de la connexion avec Google', error);
          alert(error.message);
        }
      };
    
      return {
        email,
        password,
        register,
        signInWithGoogle,
      };
    },
  };
  </script>
  