<template>
  <div class="create-job">
    <div class="cover">
      <transition name="fade">
        <img
          v-if="anime && !loadingAnime && errorAnime == null"
          class="cover"
          :src="anime.imageLarge"
        />
        <div v-else class="cover placeholder">
          {{ loadingAnime ? "Loading..." : "" }}
        </div>
      </transition>
    </div>

    <input v-model.number="animeId" type="number" placeholder="AniList ID" />

    <div>
      <input v-model.trim="magnetURI" placeholder="Magnet URI" />

      <input v-model.trim="groupName" placeholder="Group Name (Optional)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  useCreateJobAnimeQuery,
  useCreateJobMutation,
} from "@anisubs/graphql-types"
import { useResult } from "@vue/apollo-composable"
import { ref } from "vue"
import { useRoute } from "vue-router"

const { params } = useRoute()

const animeId = ref<number | null>(!isNaN ? Number(params.id) : null)

const { result, loading: loadingAnime, errorAnime } = useCreateJobAnimeQuery(
  () => ({
    id: animeId.value!,
  }),
  () => ({
    fetchPolicy: "cache-first",
    enabled: animeId?.value != null && animeId.value > 99,
    debounce: 1000,
  }),
)
const anime = useResult(result, null, (data) => data.anime?.anilist)
const hasTimestamps = useResult(
  result,
  false,
  (data) => data.anime!.entries.length > 0,
)

const magnetURI = ref("")

const groupName = ref("")

const { mutate, loading, error } = useCreateJobMutation({})
</script>

<style lang="scss" scoped>
.create-job {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > .cover {
    position: relative;
    height: 200px;
    width: 133px;
    margin-bottom: 10px;

    border-radius: 15px;
    background: var(--bg-secondary);
    overflow: hidden;

    & > img,
    & > .placeholder {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
    }

    & > img {
      object-fit: cover;
    }

    & > .placeholder {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }
  }
}

input {
  padding: 10px 15px;

  border-radius: 8px;
  border: 0;
  background: var(--bg-primary);

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>
