<template>
    <div>
      <section class="section">
        <div class="container">
          <h1 class="title">Tâches complétées</h1>
          <ul class="tasks-list">
            <li v-for="task in completedTasks" :key="task.id" class="task-item">
              <div>
                <p class="task-title">{{ task.title }}</p>
                <p class="task-description">{{ task.description }}</p>
                <p class="task-status"><i>{{ task.status }}</i></p>
              </div>
              <div class="task-actions">
                <button class="button is-danger" @click="incompleteTask(task.id)">Marquer comme incomplète</button>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import {
    getFirestore,
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
  } from "firebase/firestore";
  
  export default {
    data() {
      return {
        completedTasks: [],
      };
    },
    methods: {
      async incompleteTask(taskId) {
        try {
          const db = getFirestore();
          const taskRef = doc(db, "tasks", taskId);
  
          await updateDoc(taskRef, {
            status: "En cours",
          });
  
        } catch (error) {
          console.error("Erreur lors du marquage de la tâche comme incomplète :", error);
        }
      },
    },
    setup() {
      const completedTasks = ref([]);
  
      onMounted(async () => {
        try {
          const db = getFirestore();
          const q = query(collection(db, "tasks"), where("status", "==", "Terminée"));
  
          onSnapshot(q, (snapshot) => {
            completedTasks.value = [];
            snapshot.forEach((doc) => {
              completedTasks.value.push({ id: doc.id, ...doc.data() });
            });
          });
        } catch (error) {
          console.error("Erreur lors de la récupération des tâches complétées :", error);
        }
      });
  
      return {
        completedTasks,
      };
    },
  };
  </script>
  
  <style scoped>
  .tasks-list {
    list-style: none;
    padding: 0;
  }
  
  .task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
  }
  
  .task-title {
    font-weight: bold;
  }
  
  .task-actions {
    display: flex;
    gap: 10px;
  }
  </style>
  