import { JobType } from "@anisubs/shared"
import { Worker } from "bullmq"

import { CONFIG } from "@/config"
import { startNewExtraction } from "@/extract"

const connection = {
  ...CONFIG.redis,
}

// @ts-ignore
enum Job {
  Extract = "extract",
}

export let worker: Worker | null = null

export const startWorker = () => {
  worker = new Worker<JobType>("extraction", startNewExtraction, {
    connection,
    concurrency: 1,
  })
}
