<template>
  <div v-if="!loading && error == null" class="anime">
    <img :src="anilist.banner" class="banner" />

    <comparison :anime-id="animeId" :entries="entries" />
  </div>
</template>

<script lang="ts">
import { useAnimePageQuery } from "@anisubs/graphql-types"
import { useResult } from "@vue/apollo-composable"
import { defineComponent } from "vue"
import { useRoute } from "vue-router"

import Comparison from "@/components/comparison/index.vue"

export default defineComponent({
  components: { Comparison },
  setup() {
    const { params } = useRoute()
    const { result, loading, error } = useAnimePageQuery({
      id: Number(params.id as string),
    })

    return {
      animeId: Number(params.id),
      loading,
      error,
      anilist: useResult(result, null, (data) => data.anime!.anilist),
      entries: useResult(result, [], (data) => data.anime!.entries),
    }
  },
})
</script>

<style lang="scss" scoped>
.anime {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > .banner {
    width: 100%;
    max-height: 125px;
    object-fit: cover;
  }
}
</style>
