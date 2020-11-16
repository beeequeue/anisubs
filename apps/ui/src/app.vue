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

* {
  transition: color 0.5s, background-color 0.5s;
}

body {
  --bg-body: #101516;
  --bg-primary: #182225;
  --bg-secondary: #1e2b2e;

  --text-primary: #eee;
  --text-secondary: #a1bab3;
  --text-tertiary: #6c9389;

  --highlight-primary-primary: #1ed497;
  --highlight-primary-secondary: #5ce6da;
  --highlight-primary-shine: transparentize(#1ed497, 0.25);

  --highlight-danger-primary: #f0163d;
  --highlight-danger-secondary: #e21b57;
  --highlight-danger-shine: transparentize(#f0163d, 0.25);

  --highlight-gradient-primary: linear-gradient(
    90deg,
    var(--highlight-primary-primary) 25%,
    var(--highlight-primary-secondary)
  );
  --highlight-gradient-danger: linear-gradient(
    90deg,
    var(--highlight-danger-primary) 25%,
    var(--highlight-danger-secondary)
  );
}

#app {
  background: var(--bg-body);
  color: var(--text-primary);
}
</style>
