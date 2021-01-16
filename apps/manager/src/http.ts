import got from "got"

import { config } from "@/config"

export const HttpClient = got.extend({
  responseType: "json",
  headers: {
    "User-Agent": config.USER_AGENT,
  },
})
