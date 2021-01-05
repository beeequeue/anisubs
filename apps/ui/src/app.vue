<template>
  <nav id="navbar">
    <router-link to="/">
      <img class="logo" src="/logo-full.svg" alt="anisubs.app" />
    </router-link>
  </nav>

  <router-view />
</template>

<script lang="ts" setup>
import { DefaultApolloClient } from "@vue/apollo-composable"
import { provide } from "vue"

import { apolloClient } from "@/apollo"
import DarkTheme from "@/themes/dark.vue"

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

* {
  transition: color 0.5s, background-color 0.5s;
}

input {
  color: var(--text-primary);
}

#app {
  background: var(--bg-body);
  color: var(--text-primary);
  fill: var(--text-primary);
  overflow: auto;
}

a {
  color: var(--highlight-primary-secondary);
  font-weight: 100;
  text-shadow: 0 0 2px var(--highlight-primary-shine);
  text-decoration: none;

  & .icon {
    fill: var(--highlight-primary-secondary);
    filter: drop-shadow(0 0 2px var(--highlight-primary-shine));
  }

  &:hover {
    text-decoration: underline;
  }
}

.fade-enter-active,
.fade-leave-active {
  will-change: opacity;
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
