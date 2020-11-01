import { ExtractOptions } from "@anisubs/shared"
import { Job, Worker } from "bullmq"

import { CONFIG } from "@/config"
import { startNewExtraction } from "@/extract"

const connection = {
  ...CONFIG.redis,
}

export let worker: Worker | null = null

export const startWorker = () => {
  worker = new Worker<ExtractOptions>("extraction", startNewExtraction, {
    connection,
    concurrency: 1,
  })
}
