<template>
  <div class="timestamp-input">
    <input v-model.trim="input" v-maska="'##:##.###'" placeholder="00:00.000" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { useTimestampInput } from "../hooks/timestamp-input"

const { timestamps } = useTimestampInput()

const input = ref("")
</script>

<style lang="scss" scoped>
.timestamp-input {
  position: relative;
  width: 100%;

  & > input {
    width: 100%;
    text-align: center;
  }
}
</style>
