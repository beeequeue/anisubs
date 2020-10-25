import got from "got"

import { CONFIG } from "@/config"

export const HttpClient = got.extend({
  responseType: "json",
  headers: {
    "User-Agent": CONFIG.USER_AGENT,
  },
})
