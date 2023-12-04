<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Tâches en cours</h1>
        <ul class="tasks-list">
          <li v-for="task in tasks" :key="task.id" :class="['task-item', getTaskPriorityColor(task.priority)]">
            <div>
              <p class="task-title">{{ task.title }}</p>
              <p class="task-description">{{ task.description }}</p>
              <p class="task-status">{{ task.status }}</p>
              <p class="task-priority">{{ task.priority }}</p>
            </div>
            <div class="task-actions">
              <button class="button is-info" @click="editTask(task)">Modifier</button>
              <button class="button is-danger" @click="deleteTask(task.id)">Supprimer</button>
              <button class="button is-primary" @click="completeTask(task)">Compléter</button>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half">
            <div class="card">
              <div class="card-content">
                <h2 class="subtitle has-text-centered">{{ editingTask ? "Modifier" : "Ajouter" }} une tâche</h2>
                <form @submit.prevent="addOrUpdateTask" class="task-form">
                  <div class="field">
                    <label class="label">Titre</label>
                    <div class="control">
                      <input class="input" type="text" v-model="newTaskTitle" required />
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Description</label>
                    <div class="control">
                      <input class="input" type="text" v-model="newTaskDescription" required />
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Priorité</label>
                    <div class="control">
                      <div class="select">
                        <select v-model="newTaskPriority">
                          <option value="faible">Faible</option>
                          <option value="moyenne">Moyenne</option>
                          <option value="élevée">Élevée</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Lien</label>
                    <div class="control">
                      <input class="input" type="file" ref="fileInput" @change="handleFileChange" />
                    </div>
                  </div>

                  <div class="field">
                    <div class="control">
                      <button type="submit" class="button is-info">{{ editingTask ? "Enregistrer les modifications" : "Ajouter la tâche"
                      }}</button>
                      <br>
                      <button v-if="editingTask" @click="resetForm" type="button" class="button">{{ editingTask ? `Revenir à l'ajout
                        d'une tache` : "" }}</button>
                    </div>
                  </div>
                </form>
                <br>
                <p v-if="successMessage" class="has-text-success has-text-centered">{{ successMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.task-form {
  max-width: 400px;
  margin: 0 auto;
}

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

.task-status {
  font-style: italic;
}

.task-item-faible {
  background-color: #aaffaa;
}

.task-item-moyenne {
  background-color: #ffffaa;
}

.task-item-élevée {
  background-color: #ffaaaa;
}
</style>
  
<script>
import { ref, onMounted } from "vue";
import { getStorage } from "firebase/storage"; 
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  storageRef,
  uploadBytes,
  getDownloadURL,
  addDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      tasks: [],
      newTaskTitle: "",
      newTaskDescription: "",
      newTaskPriority: "faible",
      editingTask: null,
      successMessage: "",
      newTaskLink: null,
    };
  },
  methods: {
    async editTask(task) {
      this.newTaskTitle = task.title;
      this.newTaskDescription = task.description;
      this.newTaskPriority = task.priority || "faible";
      this.editingTask = task.id;
    },
    async deleteTask(taskId) {
      try {
        const db = getFirestore();
        const taskRef = doc(db, "tasks", taskId);

        await deleteDoc(taskRef);
        this.successMessage = "Tâche supprimée avec succès !";

        this.loadTasks();
      } catch (error) {
        console.error("Erreur lors de la suppression de la tâche :", error);
      }
    },
    async completeTask(task) {
      try {
        const db = getFirestore();
        const taskRef = doc(db, "tasks", task.id);

        await updateDoc(taskRef, {
          status: "Terminée",
        });

        this.successMessage = "Tâche complétée avec succès !";

        this.loadTasks();
      } catch (error) {
        console.error("Erreur lors de la complétion de la tâche :", error);
      }
    },
    handleFileChange() {
      const fileInput = this.$refs.fileInput;
      if (fileInput.files.length > 0) {
        this.newTaskLink = fileInput.files[0];
      }
    },

    async addOrUpdateTask() {
      if (!this.newTaskTitle || !this.newTaskDescription) {
        return;
      }

      try {
        const db = getFirestore();
        const storage = getStorage();

        if (this.editingTask) {
            const taskRef = doc(db, "tasks", this.editingTask);
  
            await updateDoc(taskRef, {
              title: this.newTaskTitle,
              description: this.newTaskDescription,
            });
  
            this.successMessage = "Tâche modifiée avec succès !";
  
            this.editingTask = null;
        } else {
          // Upload the file to Firebase Storage
          const fileRef = storageRef(storage, `task_files/${this.newTaskLink.name}`);
          await uploadBytes(fileRef, this.newTaskLink);

          // Get the download URL of the uploaded file
          const downloadURL = await getDownloadURL(fileRef);

          // Add the task to Firestore with the download URL
          await addDoc(collection(db, "tasks"), {
            title: this.newTaskTitle,
            description: this.newTaskDescription,
            priority: this.newTaskPriority,
            link: downloadURL,
            status: "En cours",
          });

          this.successMessage = "Tâche ajoutée avec succès!";
        }

        // Reset the form fields
        this.newTaskTitle = "";
        this.newTaskDescription = "";
        this.newTaskPriority = "faible";
        this.newTaskLink = null;

        // Refresh the tasks
        this.loadTasks();
      } catch (error) {
        console.error("Error adding or updating task:", error);
      }
    },
    getTaskPriorityColor(priority) {
      switch (priority) {
        case "faible":
          return "task-item-faible";
        case "moyenne":
          return "task-item-moyenne";
        case "élevée":
          return "task-item-élevée";
        default:
          return "";
      }
    },
    resetForm() {
      this.editingTask = null;
      this.newTaskTitle = "";
      this.newTaskDescription = "";
      this.newTaskPriority = "faible";
    },
    loadTasks() {
    },
  },
  setup() {
    const tasks = ref([]);

    onMounted(async () => {
      const db = getFirestore();
      const q = query(collection(db, "tasks"), where("status", "==", "En cours"));

      onSnapshot(q, (querySnapshot) => {
        const tasksData = [];
        querySnapshot.forEach((doc) => {
          tasksData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        tasks.value = tasksData;
      });
    });

    return {
      tasks,
    };
  },
};
</script>
