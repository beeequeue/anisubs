<template>
  <nav id="navbar">
    <router-link to="/">
      <img class="logo" src="/logo-full.svg" alt="anisubs.app" />
    </router-link>
  </nav>

  <router-view v-if="checkAuth" />
</template>

<script lang="ts" setup>
import { provideApolloClient } from "@vue/apollo-composable"
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

import { apolloClient } from "@/apollo"
import DarkTheme from "@/themes/dark.vue"
import { CONFIG } from "@/config"

provideApolloClient(apolloClient)

const { replace } = useRouter()

const checkAuth = ref(false)

onMounted(async () => {
  const response = await fetch(`${CONFIG.VUE_APP_API_URL}/me`, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
  })

  if (response.status >= 401 && response.status < 500) {
    await replace("login")
  }

  checkAuth.value = true
})
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

#app {
  display: flex;
  flex-direction: column;

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

input {
  padding: 10px 15px;

  border-radius: 8px;
  border: 0;
  background: var(--bg-primary);
  color: var(--text-primary);

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
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
