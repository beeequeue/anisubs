import { useCreateJobExistingEntriesQuery } from "@anisubs/graphql-types"
import { ref, watch } from "vue"

import { useAnimeInput } from "./anime-input"

const getNumber = (str: string) =>
  !isNaN(str as any) ? Number(str) : undefined

const id = ref<number>()
const timestamps = ref<Array<{ id: string; value: string }>>([])

const { onResult } = useCreateJobExistingEntriesQuery(
  () => ({
    id: Number(id.value!),
  }),
  () => ({
    enabled: id.value != null,
  }),
)

export const useTimestampInput = () => {
  const { animeId } = useAnimeInput()

  id.value = getNumber(animeId.value)

  watch(animeId, () => {
    id.value = getNumber(animeId.value)
  })

  onResult(({ data }) => {
    timestamps.value =
      data.anime?.entries?.[0]?.images.map((image) => ({
        id: image.id,
        value: image.timestamp,
      })) ?? []
  })

  return {
    timestamps,
  }
}
