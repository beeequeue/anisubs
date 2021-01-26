import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "./views/home.vue"),
  },
  {
    path: "/anime/:id",
    name: "Anime - :id",
    component: () =>
      import(/* webpackChunkName: "anime" */ "./views/anime.vue"),
  },
  {
    path: "/create-job",
    name: "Create Comparison",
    component: () =>
      import(
        /* webpackChunkName: "create-job" */ "./views/create-job/create-job.vue"
      ),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "./views/login.vue"),
  },
]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
