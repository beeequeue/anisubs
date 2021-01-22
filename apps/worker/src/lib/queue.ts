import { ExtractOptions } from "@anisubs/shared"
import { Job, Worker } from "bullmq"
import Redis from "ioredis"

import { CONFIG } from "@/config"
import { startNewExtraction } from "@/jobs/extract"

const client = new Redis(CONFIG.REDIS_URL)

export let worker: Worker | null = null

export const startWorker = () => {
  worker = new Worker<ExtractOptions>("extraction", startNewExtraction, {
    client,
    concurrency: 1,
  })

  worker.addListener("failed", (job: Job) => {
    console.error(`Failed to extract files:\n${job.stacktrace[0]}`)
  })
}
