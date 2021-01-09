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
      <input
        v-model.trim="fileName"
        class="magnet-uri"
        placeholder="File Name"
      />

      <button type="submit" @click.prevent="mutate">Submit</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCreateJobMutation } from "@anisubs/graphql-types"
import { ref } from "vue"
import { useRoute } from "vue-router"

import TimestampInput from "@/views/create-job/components/timestamp-input.vue"
import { useGroupInput } from "@/views/create-job/hooks/group-input"
import { useTimestampInput } from "@/views/create-job/hooks/timestamp-input"

import AnimeInput from "./components/anime-input.vue"
import GroupInput from "./components/group-input.vue"
import { useAnimeInput } from "./hooks/anime-input"

const { params } = useRoute()

const { animeId, anime } = useAnimeInput(params.id as string)
const { groupName } = useGroupInput()
const { timestamps } = useTimestampInput()

const magnetUri = ref("")
const fileName = ref("")

const { mutate, loading, error, onDone } = useCreateJobMutation(() => ({
  variables: {
    animeId: Number(animeId.value),
    source: magnetUri.value,
    fileName: fileName.value.length > 1 ? fileName.value : null,
    group: groupName.value.length > 1 ? groupName.value : null,
    timestamps: timestamps.value.map((timestamp) => timestamp.value),
  },
}))

// onDone(() => {})
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
