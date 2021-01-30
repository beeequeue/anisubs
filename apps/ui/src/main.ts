import { createApp } from "vue"
import { mask } from "vue-the-mask"

import App from "./app.vue"
import Icon from "./components/icon.vue"
import { router } from "./router"

import "modern-normalize"

const app = createApp(App)

// @ts-ignore: Missing type
app.config.devtools = true

app.use(router)

app.directive("maska", mask as any)
app.component("Icon", Icon)

app.mount("#app")
