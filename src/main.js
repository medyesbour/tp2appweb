import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bulma/css/bulma.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBVoyiOIhs8wRyMKz-GA-hDg5tmKnyW3Uw",
    authDomain: "examintra-ee405.firebaseapp.com",
    projectId: "examintra-ee405",
    storageBucket: "examintra-ee405.appspot.com",
    messagingSenderId: "189917816693",
    appId: "1:189917816693:web:e606c45b7d0ad7dcbe153c"
  };

export const firebaseApp = initializeApp(firebaseConfig);

const app = createApp(App);
app.use(router);
app.mount('#app');

