import { WorkerStatusResponse } from "@anisubs/shared"
import DataLoader from "dataloader"

import { HttpClient } from "@/http"
import type { Worker } from "@/modules/worker/worker.model"

const workerClient = HttpClient.extend()

export class WorkerService {
  statusLoader: DataLoader<Worker, WorkerStatusResponse | null>

  constructor() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.statusLoader = new DataLoader(WorkerService.fetchGetStatuses, {
      cacheKeyFn: ({ id }) => id,
    })
  }

  private static async fetchGetStatuses(
    workers: ReadonlyArray<Worker>,
  ): Promise<Array<WorkerStatusResponse | null>> {
    const results = await Promise.allSettled(
      workers.map((worker) => {
        return workerClient.get<WorkerStatusResponse>(`http://${worker.host}/status`, {
          headers: { Authorization: `Bearer ${worker.token}` },
        })
      }),
    )

    return results.map((result, i) => {
      if (result.status === "rejected") {
        console.log(
          `Failed to fetch worker (${workers[i].id}) status:\n${result.reason}`,
        )

        return null
      }

      return result.value.body
    })
  }

  async getStatusOf(worker: Worker): Promise<WorkerStatusResponse | null> {
    return this.statusLoader.load(worker)
  }
}
