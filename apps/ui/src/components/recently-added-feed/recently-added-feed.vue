<template>
  <div class="container">
    <Entry v-for="entry in entries" :key="entry.id" :entry="entry" />
  </div>
</template>

<script lang="ts" setup>
import { useRecentlyAddedFeedQuery } from "@anisubs/graphql-types"
import { useResult } from "@vue/apollo-composable"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Component import
import Entry from "../entry/entry.vue"

const { result } = useRecentlyAddedFeedQuery({
  fetchPolicy: "cache-and-network",
})
const entries = useResult(result, [], (data) => data.recentlyAdded)
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}
</style>
