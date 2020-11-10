<template>
  <img alt="Vue logo" src="./assets/logo.png" />

  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>

<script lang="ts">
import { defineComponent, provide } from "vue"
import { DefaultApolloClient } from "@vue/apollo-composable"

import HelloWorld from "./components/HelloWorld.vue"
import { apolloClient } from "./apollo"

export default defineComponent({
  name: "App",
  components: { HelloWorld },
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
})
</script>
