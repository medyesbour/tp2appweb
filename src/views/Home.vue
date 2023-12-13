<template>
    <section class="hero is-fullheight">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title is-size-1">
            Bienvenue sur l'application de gestion de tâches
          </h1>
          <br>
          <p class="subtitle is-size-4">
            Organisez votre vie avec facilité
          </p>
          <br>
            <div class="buttons is-centered">
                <router-link to="/register" class="button is-primary is-medium">
                Inscription
                </router-link>
                <router-link to="/login" class="button is-info is-medium">
                Connexion
                </router-link>
            </div>
        </div>
      </div>
    </section>
  </template>
  
  <style scoped>
  .hero {
    background-color: #f5f5f5;
  }
  
  .hero-body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .title {
    margin-bottom: 20px;
    color: #333;
  }
  
  .buttons {
    margin-top: 30px;
  }
  
  .button {
    margin-right: 10px;
  }
  </style>
  