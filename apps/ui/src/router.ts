import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "./views/home.vue"),
  },
  {
    path: "/anime/:id",
    name: "Anime",
    component: () =>
      import(/* webpackChunkName: "anime" */ "./views/anime.vue"),
  },
  {
    path: "/create-job",
    name: "Create Job",
    component: () =>
      import(/* webpackChunkName: "create-job" */ "./views/create-job.vue"),
  },
]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
