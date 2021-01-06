import { useCreateJobAnimeQuery } from "@anisubs/graphql-types"
import { useResult } from "@vue/apollo-composable"
import { ref } from "vue"

const animeId = ref("")

const { result, loading, error } = useCreateJobAnimeQuery(
  () => ({
    id: Number(animeId.value),
  }),
  () => ({
    enabled:
      animeId?.value != null &&
      !isNaN((animeId.value as unknown) as number) &&
      Number(animeId.value) > 99,
    debounce: 1000,
  }),
)

export const useAnimeInput = (initialId?: string) => {
  if (initialId != null) {
    animeId.value = initialId
  }

  return {
    animeId,
    anime: useResult(result, null, (data) => data.anime?.anilist),
    animeLoading: loading,
    animeError: error,
  }
}
