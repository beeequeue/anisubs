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

      <br />
      <br />

      <pre v-if="error != null">
        {{ JSON.stringify(error, null, 2).trim() }}
      </pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCreateJobMutation } from "@anisubs/graphql-types"
import { ref, watch } from "vue"
import { useRoute } from "vue-router"

import AnimeInput from "./components/anime-input.vue"
import GroupInput from "./components/group-input.vue"
import TimestampInput from "./components/timestamp-input.vue"
import { useAnimeInput } from "./hooks/anime-input"
import { useGroupInput } from "./hooks/group-input"
import { useTimestampInput } from "./hooks/timestamp-input"

const { params } = useRoute()

const { animeId, anime, reset: resetAnime } = useAnimeInput(params.id as string)
const { groupName, reset: resetGroup } = useGroupInput()
const {
  timestamps,
  timestampsVariable,
  reset: resetTimestamps,
} = useTimestampInput()

const magnetUri = ref("")
const fileName = ref("")

const { mutate, loading, error, onDone } = useCreateJobMutation(() => ({
  variables: {
    animeId: Number(animeId.value),
    source: magnetUri.value,
    fileName: fileName.value.length > 1 ? fileName.value : null,
    group: groupName.value.length > 1 ? groupName.value : null,
    timestamps: timestampsVariable.value,
  },
}))

const resetRest = () => {
  magnetUri.value = ""
  fileName.value = ""
}

onDone(() => {
  resetGroup()
  resetRest()
})

watch(anime, (newValue, oldValue) => {
  if (newValue == null || oldValue == null) return

  resetGroup()
  resetRest()
})
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

    & > pre {
      width: 100%;
      text-align: left;
    }
  }
}
</style>
