import { useAsyncState } from "@vueuse/core"
import { ref, watch } from "vue"
import { useRouter } from "vue-router"

import { CONFIG } from "@/config"

const loggedIn = ref(false)

export const useAuth = () => {
  const router = useRouter()

  console.log("useAuth init")

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
      console.log({ response })

      if (response.status >= 401 && response.status < 500) {
        void router.replace("/login")
      } else {
        loggedIn.value = true
      }

      return true
    }),
    false,
  )

  watch(
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    () => `${loggedIn.value}${checkedAuth.value}`,
    () => {
      console.log({
        loggedIn: loggedIn.value,
        checkedAuth: checkedAuth.value,
      })
    },
  )

  return {
    loggedIn,
    checkedAuth,
  }
}
