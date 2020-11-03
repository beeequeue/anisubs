import { CONFIG } from "@/config"
import { HttpClient } from "@/http"
import { useState } from "@/state"

type GraphQLResponse<D extends Record<string, unknown>> = {
  data: D
  errors: unknown[] | null
}

const managerClient = HttpClient.extend({
  responseType: "json",
  prefixUrl: `${CONFIG.MANAGER_URL}`,
})

export class Manager {
  static confirmQuery = `
    mutation ConfirmSelf($token: String!, $port: Int!) {
      confirmWorker(token: $token, port: $port)
    }
  `

  static async confirmSelf() {
    console.log("Confirming with manager...")

    const response = await managerClient.post<
      GraphQLResponse<{ confirmWorker: boolean }>
    >("graphql", {
      json: {
        query: this.confirmQuery,
        variables: { token: CONFIG.TOKEN, port: CONFIG.PORT },
      },
      throwHttpErrors: false,
      retry: {
        limit: 720,
        calculateDelay: () => 5000,
        methods: ["POST"],
        errorCodes: ["ETIMEDOUT", "ECONNRESET", "ECONNREFUSED"],
      },
    })

    if (response.body.errors != null) {
      throw new Error(
        `Failed to confirm token with manager:\n${response.body.errors
          .map((err) => (err as any).message)
          .join("\n")}`,
      )
    }

    if (!response.body.data.confirmWorker) {
      throw new Error("Didn't get true when confirming token with manager!")
    }

    console.log("All good!")
    const state = useState()
    state.setEnabled(true)
  }
}
