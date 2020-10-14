import DataLoader from "dataloader"
import request from "superagent"
import { Service } from "typedi"

import { config } from "@/config"
import { RequestResponse, responseIsError } from "@/lib/utils"

type Source = "anidb" | "anilist" | "myanimelist" | "kitsu"

type IDs = {
  [K in Source]: number | null
}

@Service()
export class IdsService {
  idLoader: DataLoader<Partial<IDs>, IDs | null>

  constructor() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.idLoader = new DataLoader(IdsService.batchFetchIds, {
      maxBatchSize: 100,
      batchScheduleFn: (callback) => setTimeout(callback, 100),
      cacheKeyFn: (input) => {
        const source = Object.keys(input)[0]
        return `${source}:${input[source as Source] ?? -1}`
      },
    })
  }

  private static async batchFetchIds(
    ids: ReadonlyArray<Partial<IDs>>,
  ): Promise<Array<IDs | null>> {
    const response = (await request
      .post("https://relations.yuna.moe/api/ids")
      .set("User-Agent", config.userAgent)
      .send(ids)
      .ok((res) => res.status < 299)) as RequestResponse<IDs>

    if (responseIsError(response)) {
      return ids.map(() => null)
    }

    return response.body as Array<IDs | null>
  }

  async fetchIds(source: Source, id: number): Promise<IDs | null> {
    return this.idLoader.load({ [source]: id })
  }
}
