import request from "superagent"
import NodeCache from "node-cache"

import { config } from "@/config"
import { RequestResponse, responseIsError } from "@/lib/utils"

type Source = "anidb" | "anilist" | "myanimelist" | "kitsu"

type IDs = {
  [K in Source]: number | null
}

const idCache = new NodeCache({
  stdTTL: 1000 * 60 * 60 * 24, // 24h
  checkperiod: 1000 * 60,
})

export class ARM {
  static async fetchIds(source: Source, id: number): Promise<IDs | null> {
    const cacheKey = `${source}:${id}`
    if (idCache.has(cacheKey)) {
      return idCache.get<IDs>(cacheKey)!
    }

    const response = (await request
      .get("https://relations.yuna.moe/api/ids")
      .set("User-Agent", config.userAgent)
      .query({
        source,
        id,
      })
      .ok((res) => res.status < 299)) as RequestResponse<IDs>

    if (responseIsError(response)) {
      return null
    }

    const ids = response.body as IDs

    Object.entries(ids).forEach(([s, i]) => {
      idCache.set(`${s}:${i}`, ids)
    })

    return ids
  }
}
