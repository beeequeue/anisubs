import { createApp } from "vue"

import App from "./app.vue"
import { router } from "./router"

import "modern-normalize"

const app = createApp(App)

app.use(router)

app.mount("#app")
