import { useCreateJobExistingEntriesQuery } from "@anisubs/graphql-types"
import { computed, ref, watch } from "vue"

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
  const hasPreviousTimestamps = ref(false)

  id.value = getNumber(animeId.value)

  watch(animeId, () => {
    id.value = getNumber(animeId.value)
  })

  onResult(({ data }) => {
    const newTimestamps =
      data.anime?.entries?.[0]?.images.map((image) => ({
        id: image.id,
        value: image.timestamp,
      })) ?? []

    timestamps.value = newTimestamps
    hasPreviousTimestamps.value = newTimestamps.length > 0
  })

  return {
    timestamps,
    timestampsVariable: computed(() =>
      timestamps.value.length < 1
        ? null
        : timestamps.value.map((timestamp) => timestamp.value),
    ),
    hasPreviousTimestamps,
    reset: () => {
      timestamps.value = []
    },
  }
}
