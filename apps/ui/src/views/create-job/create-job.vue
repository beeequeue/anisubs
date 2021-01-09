<template>
  <div class="create-job">
    <div class="left">
      <AnimeInput />

      <GroupInput />

      <TimestampInput />
    </div>

    <div class="right">
      <input
        v-model.trim="magnetUri"
        class="magnet-uri"
        placeholder="Magnet URI"
      />
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
  gap: 10px;

  --rest-width: 150px;

  & > .left {
    width: var(--rest-width);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  & > .right {
    height: 100%;
    width: 100%;
    max-width: 750px;
    display: flex;

    align-items: flex-start;
    flex-direction: column;

    & > .magnet-uri {
      width: 100%;
    }
  }
}
</style>
