<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |

    <router-link to="/about">About</router-link>
  </div>

  <router-view />
</template>

<script setup>
import { DefaultApolloClient } from "@vue/apollo-composable"
import { provide } from "vue"

import { apolloClient } from "@/apollo"

provide(DefaultApolloClient, apolloClient)
</script>

<style lang="scss">
</style>
