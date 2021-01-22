<template>
  <div class="login">
    <button @click="loginViaDiscord">Login via Discord</button>
  </div>
</template>

<script lang="ts" setup>
import { CONFIG } from "@/config"

const loginViaDiscord = () => {
  window.location.href = `${CONFIG.VUE_APP_API_URL}/auth/discord`
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;

  .title.big {
    font-size: 48px;
  }
}
</style>
