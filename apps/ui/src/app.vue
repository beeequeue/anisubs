<template>
  <nav id="navbar">
    <router-link to="/">
      <img class="logo" src="/logo-full.svg" alt="anisubs.app" />
    </router-link>
  </nav>

  <router-view />
</template>

<script setup>
import { DefaultApolloClient } from "@vue/apollo-composable"
import { provide } from "vue"

import { apolloClient } from "@/apollo"

provide(DefaultApolloClient, apolloClient)
</script>

<style lang="scss">
#navbar {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 24px 32px;

  & .logo {
    display: block;
    width: 350px;
  }
}
</style>
