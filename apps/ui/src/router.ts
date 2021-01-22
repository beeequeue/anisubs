import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "./views/home.vue"),
  },
  {
    path: "/anime/:id",
    name: "anime",
    component: () =>
      import(/* webpackChunkName: "anime" */ "./views/anime.vue"),
  },
  {
    path: "/create-job",
    name: "create-job",
    component: () =>
      import(
        /* webpackChunkName: "create-job" */ "./views/create-job/create-job.vue"
      ),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "./views/login.vue"),
  },
]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
