import { ExtractOptions, ExtractResult } from "@anisubs/shared"
import { Job as QueueJob, Queue, QueueEvents } from "bullmq"
import Redis from "ioredis"
import { getManager } from "typeorm"

import { config } from "@/config"
import { Entry } from "@/modules/entry/entry.model"
import { Image } from "@/modules/image/image.model"

const redis = new Redis(config.redis("manager-queue"))

const jobQueue = new Queue<ExtractOptions>("extraction", {
  connection: redis,
})

const events = new QueueEvents("extraction", {
  connection: redis,
})

enum Job {
  Extract = "extract",
}

export const addJob = async (job: ExtractOptions) => {
  return jobQueue.add(Job.Extract, job)
}

export const getJobs = async (from = 0, to = 15) => {
  return jobQueue.getWaiting(from, to)
}

export const getJobCount = async () => {
  return jobQueue.getWaitingCount()
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
events.on("completed", async ({ jobId, returnvalue }) => {
  const screenshots = (returnvalue as unknown) as ExtractResult[]

  const job = (await jobQueue.getJob(jobId)) as QueueJob<ExtractOptions>

  const entry = Entry.fromQueueJob(job)

  await getManager().transaction(async (manager) => {
    await manager.save(entry)

    const images = screenshots.map(({ fileName, timestamp }) => {
      const image = new Image()

      image.entry = entry
      image.fileName = fileName
      image.timestamp = timestamp

      return image
    })

    await manager.save(images)
  })
})
