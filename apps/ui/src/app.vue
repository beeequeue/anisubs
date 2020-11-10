<template>
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>

<script lang="ts">
import { DefaultApolloClient } from "@vue/apollo-composable"
import { defineComponent, provide } from "vue"

import { apolloClient } from "./apollo"
import HelloWorld from "./components/hello-world.vue"

export default defineComponent({
  name: "App",
  components: { HelloWorld },
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
})
</script>
