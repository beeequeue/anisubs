<template>
  <div class="create-job">
    <div class="rest">
      <AnimeInput />

      <GroupInput />

      <TimestampInput />
    </div>

    <div>
      <input v-model.trim="magnetUri" placeholder="Magnet URI" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCreateJobMutation } from "@anisubs/graphql-types"
import { ref } from "vue"
import { useRoute } from "vue-router"

import TimestampInput from "@/views/create-job/components/timestamp-input.vue"
import { useTimestampInput } from "@/views/create-job/hooks/timestamp-input"

import AnimeInput from "./components/anime-input.vue"
import GroupInput from "./components/group-input.vue"
import { useAnimeInput } from "./hooks/anime-input"

const { params } = useRoute()

const { animeId, anime } = useAnimeInput(params.id as string)
const { timestamps } = useTimestampInput()

const magnetUri = ref("")

const { mutate, loading, error } = useCreateJobMutation({})
</script>

<style lang="scss" scoped>
.create-job {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 50px;

  --rest-width: 150px;

  & > .rest {
    width: var(--rest-width);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
