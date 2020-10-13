import Bottleneck from "bottleneck"
import NodeCache from "node-cache"
import request from "superagent"
import { Service } from "typedi"

import { config } from "@/config"
import { IdsService } from "@/lib/arm"
import { RequestResponse, responseIsError } from "@/lib/utils"

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

  async fetchRating(anilistId: number): Promise<number | null> {
    if (scoreCache.has(anilistId)) {
      return scoreCache.get<number>(anilistId)!
    }

    const { myanimelist: malId } =
      (await this.idsService.fetchIds("anilist", anilistId)) ?? {}

    if (malId == null) {
      return null
    }

    const response = await jikanLimiter.schedule(
      () =>
        request
          .get(`https://api.jikan.moe/v3/anime/${malId}`)
          .set("User-Agent", config.userAgent)
          .ok((res) => res.status < 299) as Promise<
          RequestResponse<{ score: number | null }>
        >,
    )

    if (responseIsError(response)) {
      return null
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const score = response.body.score as number | null

    if (isNaN(score ?? 0) && score != null) {
      throw new Error(`Got weird score: "${score}"`)
    }

    scoreCache.set(anilistId, score)

    return score
  }
}
