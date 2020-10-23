import DataLoader from "dataloader"
import { Service } from "typedi"

import { HttpClient } from "@/http"
import { responseIsError } from "@/lib/utils"

const armClient = HttpClient.extend({
  prefixUrl: "https://relations.yuna.moe/api",
})

type Source = "anidb" | "anilist" | "myanimelist" | "kitsu"

type IDs = {
  [K in Source]: number | null
}

// TODO: Add caching
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
    const response = await armClient.post<IDs[]>("ids", {
      json: ids,
    })

    if (responseIsError(response)) {
      return ids.map(() => null)
    }

    return response.body
  }

  async fetchIds(source: Source, id: number): Promise<IDs | null> {
    return this.idLoader.load({ [source]: id })
  }
}
