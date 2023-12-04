import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from 'firebase/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("../views/Home.vue") },
    { path: "/login", component: () => import("../views/Login.vue") },
    { path: "/register", component: () => import("../views/Register.vue") },
    { path: "/tasks", component: () => import("../views/Tasks.vue") },
    {path: "/completed-tasks", component: () => import("../views/CompletedTasks.vue") },
  ]
});

export default router;
