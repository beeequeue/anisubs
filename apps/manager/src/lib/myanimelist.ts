import Bottleneck from "bottleneck"
import NodeCache from "node-cache"
import { Service } from "typedi"

import { HttpClient } from "@/http"
import { IdsService } from "@/lib/arm"
import { responseIsError } from "@/lib/utils"

const malClient = HttpClient.extend({
  prefixUrl: "https://api.jikan.moe/v3",
})

const scoreCache = new NodeCache({
  stdTTL: 1000 * 60 * 60 * 24, // 24h
  checkperiod: 1000 * 60,
})

// https://jikan.docs.apiary.io/#introduction/information/rate-limiting
// 30rpm / 2rps
const jikanLimiter = new Bottleneck({
  minTime: 500,
  maxConcurrent: 2,
  reservoir: 30,
  reservoirIncreaseMaximum: 30,
  reservoirIncreaseAmount: 1,
  reservoirIncreaseInterval: 0.5,
})

@Service()
export class MyAnimeListService {
  constructor(private readonly idsService: IdsService) {}

  async fetchRating(animeId: number): Promise<number | null> {
    if (scoreCache.has(animeId)) {
      return scoreCache.get<number>(animeId)!
    }

    const { myanimelist: malId } =
      (await this.idsService.fetchIds("anilist", animeId)) ?? {}

    if (malId == null) {
      return null
    }

    const response = await jikanLimiter.schedule(() =>
      malClient.get<{ score: number | null }>(`anime/${malId}`),
    )

    if (responseIsError(response)) {
      return null
    }

    const score = response.body.score

    if (isNaN(score ?? 0) && score != null) {
      throw new Error(`Got weird score: "${score}"`)
    }

    scoreCache.set(animeId, score)

    return score
  }
}
