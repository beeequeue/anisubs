import Bottleneck from "bottleneck"
import NodeCache from "node-cache"
import { NyaaTorrent, pantsu } from "nyaapi"
import { Service } from "typedi"

const nyaaCache = new NodeCache({
  stdTTL: 1000 * 60 * 60 * 24, // 24h
  checkperiod: 1000 * 60,
})

// https://jikan.docs.apiary.io/#introduction/information/rate-limiting
// 30rpm / 2rps
const nyaaLimiter = new Bottleneck({
  minTime: 500,
  maxConcurrent: 2,
  reservoir: 30,
  reservoirIncreaseMaximum: 30,
  reservoirIncreaseAmount: 1,
  reservoirIncreaseInterval: 0.5,
})

@Service()
export class NyaaService {
  async fetchRating(query: string): Promise<NyaaTorrent[]> {
    if (nyaaCache.has(query)) {
      return nyaaCache.get<NyaaTorrent[]>(query)!
    }

    const result = await nyaaLimiter.schedule(() =>
      pantsu
        .search(query, 25, {
          c: ["3"],
          order: "false",
          sort: "4",
          lang: "en",
        })
        .catch((err) => err as Error),
    )

    if (result instanceof Error) {
      result.message = result.message.replace(/\[.*?]: +/, "")

      throw result
    }

    nyaaCache.set(query, result)

    return result
  }
}
