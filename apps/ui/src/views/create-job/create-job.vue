<template>
  <div class="create-job">
    <AnimeInput />

    <div>
      <input v-model.trim="magnetUri" placeholder="Magnet URI" />

      <input v-model.trim="groupName" placeholder="Group Name (Optional)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  useCreateJobExistingEntriesQuery,
  useCreateJobMutation,
} from "@anisubs/graphql-types"
import { useResult } from "@vue/apollo-composable"
import { ref } from "vue"
import { useRoute } from "vue-router"

import AnimeInput from "./components/anime-input.vue"
import { useAnimeInput } from "./hooks/anime-input"

const { params } = useRoute()

const { animeId } = useAnimeInput(params.id)

const { result } = useCreateJobExistingEntriesQuery(
  () => ({
    id: Number(animeId.value),
  }),
  () => ({
    enabled: isNaN(animeId.value),
  }),
)

const hasTimestamps = useResult(
  result,
  false,
  (data) => data.anime!.entries.length > 0,
)

const magnetUri = ref("")

const groupName = ref("")

const { mutate, loading, error } = useCreateJobMutation({})
</script>

<style lang="scss" scoped>
.create-job {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
