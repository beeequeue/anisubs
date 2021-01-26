import { CONFIG } from "@/config"
import { startNewExtraction } from "@/jobs/extract"
import { ExtractOptions } from "@anisubs/shared"
import { Job, Worker } from "bullmq"
import Redis from "ioredis"

const redis = new Redis(CONFIG.redis("worker-queue"))

export let worker: Worker | null = null

export const startWorker = () => {
  worker = new Worker<ExtractOptions>("extraction", startNewExtraction, {
    connection: redis,
    concurrency: 1,
  })

  worker.addListener("failed", (job: Job) => {
    console.error(`Failed to extract files:\n${job.stacktrace[0]}`)
  })
}
