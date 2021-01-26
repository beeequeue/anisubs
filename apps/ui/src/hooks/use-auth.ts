import { useAsyncState } from "@vueuse/core"
import { ref, watch } from "vue"
import { useRouter } from "vue-router"

import { CONFIG } from "@/config"

const loggedIn = ref(false)

export const useAuth = () => {
  const router = useRouter()

  watch(router.currentRoute, () => {
    if (!loggedIn.value) {
      void router.replace("/login")
    }
  })

  const { state: checkedAuth } = useAsyncState(
    fetch(`${CONFIG.VUE_APP_API_URL}/me`, {
      method: "GET",
      credentials: "include",
      cache: "no-cache",
    }).then((response) => {
      if (response.status >= 401 && response.status < 500) {
        void router.replace("/login")
      } else {
        loggedIn.value = true
      }

      return true
    }),
    false,
  )

  return {
    loggedIn,
    checkedAuth,
  }
}
