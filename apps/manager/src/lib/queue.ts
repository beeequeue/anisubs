import { ExtractOptions } from "@anisubs/shared"
import { Queue, QueueEvents, Job as QueueJob } from "bullmq"
import { getManager } from "typeorm"

import { config } from "@/config"
import { Entry } from "@/modules/entry/entry.model"
import { Image } from "@/modules/image/image.model"

const jobQueue = new Queue<ExtractOptions>("extraction", {
  connection: {
    ...config.redis,
  },
})

const events = new QueueEvents("extraction", {
  connection: {
    ...config.redis,
  },
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
  const screenshots = (returnvalue as unknown) as string[]

  const job = (await jobQueue.getJob(jobId)) as QueueJob<ExtractOptions>

  const entry = Entry.fromQueueJob(job)

  await getManager().transaction(async (manager) => {
    await manager.save(entry)

    const images = screenshots.map((url, i) => {
      const image = new Image()

      image.entry = entry
      image.filename = url
      image.timestamp = job.data.timestamps![i]

      return image
    })

    await manager.save(images)
  })
})
