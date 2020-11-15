<template>
  <div class="container">
    <div v-for="entry in entries" :key="entry.id" class="entry">
      {{ entry.group.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRecentlyAddedFeedQuery } from "@anisubs/graphql-types"
import { useResult } from "@vue/apollo-composable"

const { result } = useRecentlyAddedFeedQuery()
export const entries = useResult(result, [], (data) => data.recentlyAdded)
</script>

<style lang="scss" scoped>
.container {
}
</style>
