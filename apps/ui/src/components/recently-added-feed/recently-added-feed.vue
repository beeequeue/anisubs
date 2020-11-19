<template>
  <div class="container">
    <Entry v-for="entry in entries" :key="entry.id" :entry="entry" />
  </div>
</template>

<script lang="ts" setup>
import { useRecentlyAddedFeedQuery } from "@anisubs/graphql-types"
import { useResult } from "@vue/apollo-composable"

export { default as Entry } from "../entry/entry.vue"

const { result } = useRecentlyAddedFeedQuery()
export const entries = useResult(result, [], (data) => data.recentlyAdded)
</script>

<style lang="scss" scoped>
.container {
}
</style>
