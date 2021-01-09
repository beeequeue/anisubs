import { ref } from "vue"

const groupName = ref("")

export const useGroupInput = () => {
  return {
    groupName,
    reset: () => {
      groupName.value = ""
    },
  }
}
